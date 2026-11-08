const severities = ["info", "low", "moderate", "high", "critical"] as const;
type Severity = (typeof severities)[number];
type Scope = "production" | "all";
type Dictionary = Record<string, unknown>;

const advisoryIdPattern = /^(?:GHSA-(?:[a-z0-9]{4}-){2}[a-z0-9]{4}|npm:[1-9]\d*)$/;
const packagePattern = /^(?:@[a-z0-9_.-]+\/)?[a-z0-9_.-]+$/i;
const stableVersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const installedVersionPattern =
  /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[a-z0-9-]+(?:\.[a-z0-9-]+)*)?(?:\+[a-z0-9-]+(?:\.[a-z0-9-]+)*)?$/i;
// pnpm can stop enumerating additional paths after this threshold.
const pnpmPathLimit = 100;

interface Finding {
  id: string;
  package: string;
  severity: Severity;
  version: string;
  path: string;
  scopes: Scope[];
  pathsMayBeTruncated: boolean;
}

type Version = [number, number, number];

interface Exception {
  advisoryId: string;
  package: string;
  path: string;
  minInclusive: Version;
  maxExclusive: Version;
}

function object(value: unknown, field: string): Dictionary {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid ${field}: expected an object.`);
  }
  return value as Dictionary;
}

function requiredText(value: unknown, field: string, pattern?: RegExp): string {
  if (typeof value !== "string" || value.trim() === "" || (pattern && !pattern.test(value))) {
    throw new Error(`Invalid ${field}: expected a non-empty string in the supported format.`);
  }
  return value;
}

function items(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Invalid ${field}: expected an array.`);
  return value as unknown[];
}

function dependencyPath(value: unknown): string {
  const path = requiredText(value, "dependency path");
  const segments = path.split(">");
  if (segments.length < 2 || segments.some((segment) => !packagePattern.test(segment))) {
    throw new Error("Invalid dependency path: expected exact pnpm path segments.");
  }
  return path;
}

function reportFindings(value: unknown, scope: Scope): { findings: Finding[]; count: number } {
  const report = object(value, "Audit report");
  const advisories = object(report.advisories, "Audit advisories");
  const metadata = object(report.metadata, "Audit metadata");
  const counts = object(metadata.vulnerabilities, "Audit severity counts");
  const findings: Finding[] = [];
  const actualCounts = new Map<Severity, number>();

  for (const [key, entry] of Object.entries(advisories)) {
    const advisory = object(entry, "Audit advisory");
    if (
      typeof advisory.id !== "number" ||
      !Number.isSafeInteger(advisory.id) ||
      advisory.id <= 0 ||
      String(advisory.id) !== key
    ) {
      throw new Error("Invalid Audit advisory ID.");
    }
    const id = requiredText(
      advisory.github_advisory_id === "" ? `npm:${key}` : advisory.github_advisory_id,
      "Audit advisory ID",
      advisoryIdPattern,
    );
    const packageName = requiredText(advisory.module_name, "Audit package", packagePattern);
    const severity = severities.find((level) => level === advisory.severity);
    if (!severity) throw new Error("Invalid Audit severity.");
    actualCounts.set(severity, (actualCounts.get(severity) ?? 0) + 1);

    const entries = items(advisory.findings, "Audit findings");
    if (!entries.length) throw new Error("Invalid Audit advisory: findings are missing.");
    for (const entry of entries) {
      const finding = object(entry, "Audit finding");
      const version = requiredText(
        finding.version,
        "Audit installed version",
        installedVersionPattern,
      );
      const paths = items(finding.paths, "Audit dependency paths");
      if (!paths.length) throw new Error("Invalid Audit finding: dependency paths are missing.");
      for (const path of paths) {
        findings.push({
          id,
          package: packageName,
          severity,
          version,
          path: dependencyPath(path),
          scopes: [scope],
          pathsMayBeTruncated: paths.length >= pnpmPathLimit,
        });
      }
    }
  }

  if (
    Object.keys(counts).length !== severities.length ||
    severities.some((level) => counts[level] !== (actualCounts.get(level) ?? 0))
  ) {
    throw new Error("Invalid Audit metadata: severity counts do not match advisories.");
  }
  return { findings, count: Object.keys(advisories).length };
}

function mergeFindings(findings: Finding[]): Finding[] {
  const merged = new Map<string, Finding>();
  for (const finding of findings) {
    const key = JSON.stringify([finding.id, finding.package, finding.version, finding.path]);
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, finding);
      continue;
    }
    if (existing.severity !== finding.severity) {
      throw new Error("Conflicting Audit severity for the same finding. Retry the Audit.");
    }
    existing.scopes = [...new Set([...existing.scopes, ...finding.scopes])];
    existing.pathsMayBeTruncated ||= finding.pathsMayBeTruncated;
  }
  return [...merged.values()];
}

function stableVersion(value: unknown): Version {
  const match = stableVersionPattern.exec(requiredText(value, "exception version bound"));
  if (!match)
    throw new Error("Invalid exception version bound: expected stable major.minor.patch.");
  const version = [Number(match[1]), Number(match[2]), Number(match[3])] as Version;
  if (!version.every(Number.isSafeInteger)) throw new Error("Invalid exception version bound.");
  return version;
}

function compareVersions(left: Version, right: Version): number {
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
}

function utcDate(value: unknown, field: string): string {
  const date = requiredText(value, field, /^\d{4}-\d{2}-\d{2}$/);
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid ${field}: expected a real UTC date.`);
  }
  return date;
}

function parseExceptions(policy: unknown, today: string): Exception[] {
  return items(object(policy, "Audit exception policy").exceptions, "Audit exceptions").map(
    (value) => {
      const exception = object(value, "Audit exception");
      const advisoryId = requiredText(
        exception.advisoryId,
        "exception advisory ID",
        advisoryIdPattern,
      );
      const packageName = requiredText(exception.package, "exception package", packagePattern);
      const path = dependencyPath(exception.path);
      const range = object(exception.versionRange, "exception version range");
      const minInclusive = stableVersion(range.minInclusive);
      const maxExclusive = stableVersion(range.maxExclusive);
      if (compareVersions(minInclusive, maxExclusive) >= 0)
        throw new Error("Invalid exception version range.");
      requiredText(exception.executionContext, "exception execution context");
      requiredText(exception.rationale, "exception rationale");
      const owner = requiredText(exception.owner, "exception owner").trim();
      const approver = requiredText(exception.approver, "exception approver").trim();
      if (owner.toLowerCase() === approver.toLowerCase())
        throw new Error("An exception requires an independent approver.");
      const reviewOn = utcDate(exception.reviewOn, "exception review date");
      const expiresOn = utcDate(exception.expiresOn, "exception expiry date");
      if (reviewOn > expiresOn) throw new Error("Invalid exception: review date follows expiry.");
      if (today >= expiresOn) throw new Error(`Expired Audit exception for ${advisoryId}.`);
      return { advisoryId, package: packageName, path, minInclusive, maxExclusive };
    },
  );
}

function blocksBySeverity(severity: Severity): boolean {
  return severity === "high" || severity === "critical";
}

function matchesException(exception: Exception, finding: Finding): boolean {
  if (
    exception.advisoryId !== finding.id ||
    exception.package !== finding.package ||
    exception.path !== finding.path ||
    !blocksBySeverity(finding.severity) ||
    !stableVersionPattern.test(finding.version)
  ) {
    return false;
  }
  const version = stableVersion(finding.version);
  return (
    compareVersions(version, exception.minInclusive) >= 0 &&
    compareVersions(version, exception.maxExclusive) < 0
  );
}

export function evaluateAudit(production: unknown, full: unknown, policy: unknown, today: string) {
  const exceptions = parseExceptions(policy, utcDate(today, "Audit date"));
  const findings = mergeFindings([
    ...reportFindings(production, "production").findings,
    ...reportFindings(full, "all").findings,
  ]);
  const incomplete = new Set(
    findings
      .filter((finding) => finding.pathsMayBeTruncated)
      .map((finding) => JSON.stringify([finding.id, finding.package, finding.version])),
  );

  for (const exception of exceptions) {
    const matches = findings.filter((finding) => matchesException(exception, finding));
    if (!matches.length)
      throw new Error(
        `Stale Audit exception for ${exception.advisoryId}: version or path no longer matches.`,
      );
    if (
      matches.some((finding) =>
        incomplete.has(JSON.stringify([finding.id, finding.package, finding.version])),
      )
    ) {
      throw new Error(
        `Audit paths are truncated for ${exception.advisoryId}; the exception cannot be applied.`,
      );
    }
  }

  const decisions = findings.map((finding) => {
    const status = !blocksBySeverity(finding.severity)
      ? "follow-up"
      : exceptions.some((exception) => matchesException(exception, finding))
        ? "exception"
        : "blocked";
    return { ...finding, status } as const;
  });
  return {
    findings: decisions,
    passed: decisions.every((decision) => decision.status !== "blocked"),
  };
}

export function decodeAuditResult(result: {
  status: number | null;
  stdout: string;
  signal?: string | null;
  error?: Error;
}): unknown {
  if (result.error || result.signal || (result.status !== 0 && result.status !== 1)) {
    throw new Error("Audit command failed to return a report.");
  }
  let report: unknown;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    throw new Error("Audit command failed to return valid JSON.");
  }
  const { count } = reportFindings(report, "all");
  if ((result.status === 0) !== (count === 0)) {
    throw new Error("Audit exit status does not match the reported findings.");
  }
  return report;
}
