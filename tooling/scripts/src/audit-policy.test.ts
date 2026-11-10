import assert from "node:assert/strict";
import { test } from "node:test";

import { decodeAuditResult, evaluateAudit } from "./audit-policy.ts";

const today = "2026-11-08";
const firstPath = "apps__web>fixture-builder>fast-uri";
const secondPath = "tooling__scripts>fixture-builder>fast-uri";
const patchedVersion = "3.1.9";

function advisory({
  id = 101,
  advisoryId = "GHSA-g7r4-m6w7-qqqr",
  severity = "high",
  version = "3.1.2",
  paths = [firstPath],
} = {}) {
  return {
    id,
    github_advisory_id: advisoryId,
    module_name: "fast-uri",
    severity,
    title: "Fixture advisory",
    url: `https://github.com/advisories/${advisoryId}`,
    vulnerable_versions: `<${patchedVersion}`,
    patched_versions: `>=${patchedVersion}`,
    findings: [{ version, paths, dev: false, optional: false, bundled: false }],
  };
}

function report(...advisories: ReturnType<typeof advisory>[]) {
  const severities = ["info", "low", "moderate", "high", "critical"];

  return {
    advisories: Object.fromEntries(advisories.map((item) => [String(item.id), item])),
    metadata: {
      vulnerabilities: Object.fromEntries(
        severities.map((severity) => [
          severity,
          advisories.filter((item) => item.severity === severity).length,
        ]),
      ),
      dependencies: 5,
      devDependencies: 0,
      optionalDependencies: 0,
      totalDependencies: 5,
    },
  };
}

const noExceptions = { exceptions: [] };
const approvedException = {
  advisoryId: "GHSA-g7r4-m6w7-qqqr",
  package: "fast-uri",
  versionRange: { minInclusive: "3.1.2", maxExclusive: "3.1.5" },
  path: firstPath,
  executionContext: "Build tooling for fixture-only data",
  rationale: "Fixture values never reach the vulnerable operation",
  owner: "fixture-owner",
  approver: "fixture-reviewer",
  reviewOn: "2026-11-20",
  expiresOn: "2026-12-01",
};

test("merges the same advisory occurrence across Audit scopes and preserves additional paths", () => {
  const production = report(advisory());
  const full = report(advisory({ paths: [firstPath, secondPath] }));

  const decision = evaluateAudit(production, full, noExceptions, today);

  assert.equal(decision.passed, false);
  assert.equal(decision.findings.length, 2);
  const byPath = new Map(decision.findings.map((finding) => [finding.path, finding]));
  const common = byPath.get(firstPath);
  assert.ok(common);
  assert.equal(common.id, approvedException.advisoryId);
  assert.equal(common.package, "fast-uri");
  assert.equal(common.version, "3.1.2");
  assert.equal(common.status, "blocked");
  assert.deepEqual(new Set(common.scopes), new Set(["production", "all"]));
  assert.deepEqual(byPath.get(secondPath)?.scopes, ["all"]);
});

test("blocks a Critical finding in the full Audit even when Production is clean", () => {
  const full = report(advisory({ severity: "critical" }));

  const decision = evaluateAudit(report(), full, noExceptions, today);

  assert.equal(decision.passed, false);
  assert.deepEqual(
    decision.findings.map(({ severity, status }) => ({ severity, status })),
    [{ severity: "critical", status: "blocked" }],
  );
});

test("retains Moderate and Low findings as follow-ups without blocking the gate", () => {
  const full = report(
    advisory({ severity: "moderate" }),
    advisory({ id: 102, advisoryId: "GHSA-vh95-rmgr-6w4m", severity: "low" }),
  );

  const decision = evaluateAudit(report(), full, noExceptions, today);

  assert.equal(decision.passed, true);
  assert.equal(decision.findings.length, 2);
  assert.deepEqual(
    new Map(decision.findings.map(({ severity, status }) => [severity, status])),
    new Map([
      ["moderate", "follow-up"],
      ["low", "follow-up"],
    ]),
  );
});

test("applies a valid exception on the inclusive minimum version and exact path", () => {
  const input = report(advisory());

  const decision = evaluateAudit(input, input, { exceptions: [approvedException] }, today);

  assert.equal(decision.passed, true);
  assert.deepEqual(
    decision.findings.map((finding) => finding.status),
    ["exception"],
  );
});

test("leaves a second dependency path blocked when the approved path is present", () => {
  const input = report(advisory({ paths: [firstPath, secondPath] }));

  const decision = evaluateAudit(input, input, { exceptions: [approvedException] }, today);

  assert.equal(decision.passed, false);
  assert.deepEqual(
    new Map(decision.findings.map(({ path, status }) => [path, status])),
    new Map([
      [firstPath, "exception"],
      [secondPath, "blocked"],
    ]),
  );
});

test("leaves an out-of-range installed version blocked on the approved path", () => {
  const item = advisory();
  const full = report({
    ...item,
    findings: [...item.findings, ...advisory({ version: "3.1.5" }).findings],
  });

  const decision = evaluateAudit(report(item), full, { exceptions: [approvedException] }, today);

  assert.equal(decision.passed, false);
  assert.deepEqual(
    new Map(decision.findings.map(({ version, status }) => [version, status])),
    new Map([
      ["3.1.2", "exception"],
      ["3.1.5", "blocked"],
    ]),
  );
});

test("rejects an exception at the start of its UTC expiration date", () => {
  const input = report(advisory());

  assert.throws(() =>
    evaluateAudit(input, input, { exceptions: [approvedException] }, approvedException.expiresOn),
  );
});

test("rejects stale exceptions for changed versions or paths and for fixed advisories", () => {
  const differentVersion = report(advisory({ version: "3.1.5" }));
  const differentPath = report(advisory({ paths: [secondPath] }));

  for (const input of [differentVersion, differentPath, report()]) {
    assert.throws(() => evaluateAudit(input, input, { exceptions: [approvedException] }, today));
  }
});

test("rejects invalid exception policy including missing approval and reversed version bounds", () => {
  const input = report(advisory());
  const { approver: _approver, ...withoutApprover } = approvedException;

  assert.throws(() => evaluateAudit(input, input, {}, today));
  assert.throws(() => evaluateAudit(input, input, { exceptions: [withoutApprover] }, today));
  assert.throws(() =>
    evaluateAudit(
      input,
      input,
      {
        exceptions: [
          { ...approvedException, versionRange: { minInclusive: "3.2.0", maxExclusive: "3.1.2" } },
        ],
      },
      today,
    ),
  );
});

test("rejects unrecognized or inconsistent Audit reports", () => {
  const clean = report();
  const vulnerable = report(advisory());
  const droppedAdvisory = { ...vulnerable, advisories: {} };

  for (const invalid of [
    {},
    { ...clean, metadata: { ...clean.metadata, vulnerabilities: { high: 0 } } },
    droppedAdvisory,
    report(advisory({ severity: "unknown" })),
    report(advisory({ paths: [] })),
  ]) {
    assert.throws(() => evaluateAudit(clean, invalid, noExceptions, today));
  }
});

test("does not allow exceptions to cover a saturated set of pnpm-reported paths", () => {
  const paths = Array.from({ length: 100 }, (_, index) => `apps__web>fixture-${index}>fast-uri`);
  const input = report(advisory({ paths }));
  const exceptions = paths.map((path) => ({ ...approvedException, path }));

  assert.throws(() => evaluateAudit(input, input, { exceptions }, today));
});

test("accepts additional importer paths emitted by pnpm after the nominal path cap", () => {
  const paths = Array.from({ length: 100 }, (_, index) => `apps__web>fixture-${index}>fast-uri`);
  paths.push(secondPath);
  const input = report(advisory({ severity: "moderate", paths }));

  const decision = evaluateAudit(report(), input, noExceptions, today);

  assert.equal(decision.passed, true);
  assert.equal(decision.findings.length, 101);
  assert.ok(
    decision.findings.some(({ path, status }) => path === secondPath && status === "follow-up"),
  );
});

test("accepts a clean pnpm report and its nonzero exit for a valid finding", () => {
  const clean = report();
  const vulnerable = report(advisory());

  assert.deepEqual(decodeAuditResult({ status: 0, stdout: JSON.stringify(clean) }), clean);
  assert.deepEqual(
    decodeAuditResult({ status: 1, stdout: JSON.stringify(vulnerable) }),
    vulnerable,
  );
});

test("rejects unsuccessful lookup, malformed JSON, and exit status/report inconsistencies", () => {
  const clean = JSON.stringify(report());
  const vulnerable = JSON.stringify(report(advisory()));

  for (const result of [
    { status: 1, stdout: JSON.stringify({ error: { code: "AUDIT_BAD_RESPONSE" } }) },
    { status: 0, stdout: "registry returned HTML" },
    { status: 0, stdout: vulnerable },
    { status: 1, stdout: clean },
    { status: 2, stdout: clean },
    { status: null, stdout: clean, signal: "SIGTERM" },
    { status: null, stdout: "", error: new Error("spawn failed") },
  ]) {
    assert.throws(() => decodeAuditResult(result));
  }
});
