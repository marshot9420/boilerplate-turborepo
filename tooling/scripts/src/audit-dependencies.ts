import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

import { decodeAuditResult, evaluateAudit } from "./audit-policy.ts";

const policyFile = new URL("../config/audit-exceptions.json", import.meta.url);
const defaultLockfile = new URL("../../../pnpm-lock.yaml", import.meta.url);
const rootManifest = new URL("../../../package.json", import.meta.url);
const registry = "https://registry.npmjs.org/";

function sha256(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

/* eslint-disable turbo/no-undeclared-env-vars -- The Audit CLI runs directly outside Turbo. */
function pnpmRunner(directory: string) {
  const script = process.env.npm_execpath;
  const useNode = script !== undefined && /\.[cm]?js$/i.test(script);

  return (args: string[]) =>
    spawnSync(useNode ? process.execPath : "pnpm", useNode ? [script, ...args] : args, {
      cwd: directory,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      timeout: 90_000,
      env: {
        PATH: process.env.PATH,
        SystemRoot: process.env.SystemRoot,
        HOME: directory,
        USERPROFILE: directory,
        XDG_CONFIG_HOME: directory,
        npm_config_userconfig: path.join(directory, "empty-user-config"),
        npm_config_globalconfig: path.join(directory, "empty-global-config"),
        CI: "true",
      },
    });
}
/* eslint-enable turbo/no-undeclared-env-vars */

function runAudit() {
  const { values } = parseArgs({
    options: { lockfile: { type: "string" }, commit: { type: "string" } },
  });
  if (values.commit !== undefined && !/^[a-f0-9]{40}$/.test(values.commit)) {
    throw new Error("Expected a full Git commit SHA.");
  }
  const lockfile = readFileSync(values.lockfile ?? defaultLockfile);
  const policy = readFileSync(policyFile);
  const pinned = (JSON.parse(readFileSync(rootManifest, "utf8")) as { packageManager: string })
    .packageManager;
  const directory = mkdtempSync(path.join(tmpdir(), "dependency-audit-"));

  try {
    writeFileSync(path.join(directory, "pnpm-lock.yaml"), lockfile);
    writeFileSync(
      path.join(directory, "package.json"),
      '{"name":"dependency-audit-input","private":true}\n',
    );
    const runPnpm = pnpmRunner(directory);
    const version = runPnpm(["--version"]);
    if (version.status !== 0 || `pnpm@${version.stdout.trim()}` !== pinned) {
      throw new Error(`Expected the trusted ${pinned} executable.`);
    }

    const args = [
      "audit",
      "--json",
      "--audit-level",
      "info",
      "--registry",
      registry,
      "--fetch-retries",
      "1",
    ];
    const production = decodeAuditResult(runPnpm([...args, "--prod"]));
    const full = decodeAuditResult(runPnpm(args));
    const generatedAt = new Date().toISOString();
    const decision = evaluateAudit(
      production,
      full,
      JSON.parse(policy.toString("utf8")),
      generatedAt.slice(0, 10),
    );

    console.log(
      JSON.stringify(
        {
          generatedAt,
          commit: values.commit ?? null,
          lockfileSha256: sha256(lockfile),
          policySha256: sha256(policy),
          pnpm: pinned,
          passed: decision.passed,
          findings: decision.findings.map((finding) => ({
            ...finding,
            ...(finding.status === "follow-up"
              ? { plan: "Review a compatible package or parent patch before the next release." }
              : {}),
          })),
        },
        null,
        2,
      ),
    );
    if (!decision.passed) process.exitCode = 1;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

try {
  runAudit();
} catch (error) {
  // Avoid printing registry responses or inherited environment values on error.
  console.error(
    `Dependency Audit failed: ${error instanceof Error ? error.message : "Unknown error."}`,
  );
  process.exitCode = 1;
}
