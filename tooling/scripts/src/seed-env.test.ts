import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { copyFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test, type TestContext } from "node:test";
import { pathToFileURL } from "node:url";

const developmentDb = "postgresql://fixture@localhost/development";
const injectedE2EDb = "postgresql://fixture@localhost/injected_e2e";
const fileE2EDb = "postgresql://fixture@localhost/file_e2e";
const databaseImportMarker = "fixture:database-client-imported";

async function runSeed(
  t: TestContext,
  entry: "seed.ts" | "seed-e2e.ts",
  env: NodeJS.ProcessEnv,
  files: Record<string, string> = {},
) {
  const root = await mkdtemp(path.join(tmpdir(), "seed-env-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));

  const scripts = path.join(root, "tooling", "scripts", "src");
  await mkdir(scripts, { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}\n');
  await copyFile(new URL(entry, import.meta.url), path.join(scripts, entry));
  const helper = new URL("./seed-env.ts", import.meta.url);
  if (existsSync(helper)) {
    await copyFile(helper, path.join(scripts, "seed-env.ts"));
  }
  for (const [name, contents] of Object.entries(files)) {
    await writeFile(path.join(root, name), contents);
  }

  const databaseStub = `console.log(${JSON.stringify(databaseImportMarker)});
    console.log(JSON.stringify({ databaseUrl: process.env.DATABASE_URL, directUrl: process.env.DIRECT_URL, e2e: process.env.E2E, nodeEnv: process.env.NODE_ENV }));
    process.exit(0);`;
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      `import { registerHooks } from "node:module";
       registerHooks({ resolve(specifier, context, nextResolve) {
         if (specifier === "@repo/database/script-client") {
           return { url: ${JSON.stringify(`data:text/javascript,${encodeURIComponent(databaseStub)}`)}, shortCircuit: true };
         }
         if (specifier === "dotenv") {
           return { url: ${JSON.stringify(import.meta.resolve("dotenv"))}, shortCircuit: true };
         }
         return nextResolve(specifier, context);
       } });
       await import(${JSON.stringify(pathToFileURL(path.join(scripts, entry)).href)});`,
    ],
    { cwd: root, env, encoding: "utf8", timeout: 10_000 },
  );
  assert.ifError(result.error);
  return result;
}

function assertRejectedBeforeDatabaseImport(result: Awaited<ReturnType<typeof runSeed>>) {
  assert.equal(result.status, 1);
  assert.doesNotMatch(result.stdout, new RegExp(databaseImportMarker));
  assert.doesNotMatch(result.stdout + result.stderr, /postgres(?:ql)?:\/\//);
}

test("development seed preserves injected values before importing the database client", async (t) => {
  const result = await runSeed(
    t,
    "seed.ts",
    { DATABASE_URL: developmentDb, DIRECT_URL: developmentDb },
    { ".env.local": `DATABASE_URL=${fileE2EDb}\nDIRECT_URL=${fileE2EDb}\n` },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(databaseImportMarker));
  assert.deepEqual(JSON.parse(result.stdout.trim().split("\n").at(-1) ?? ""), {
    databaseUrl: developmentDb,
    directUrl: developmentDb,
  });
});

test("development seed refuses production, test, E2E and hosted modes before database import", async (t) => {
  for (const mode of [
    { NODE_ENV: "production" },
    { NODE_ENV: "test" },
    { E2E: "true" },
    { VERCEL_ENV: "preview" },
    { VERCEL_ENV: "production" },
  ]) {
    const result = await runSeed(t, "seed.ts", {
      ...mode,
      DATABASE_URL: developmentDb,
      DIRECT_URL: developmentDb,
    });
    assertRejectedBeforeDatabaseImport(result);
    assert.match(result.stderr, /seed/i);
  }
});

test("E2E seed selects the dedicated file over injected and development files before database import", async (t) => {
  const result = await runSeed(
    t,
    "seed-e2e.ts",
    { E2E: "true", NODE_ENV: "production", DATABASE_URL: injectedE2EDb, DIRECT_URL: injectedE2EDb },
    {
      ".env": `DATABASE_URL=${developmentDb}\nDIRECT_URL=${developmentDb}\n`,
      ".env.local": `DATABASE_URL=${developmentDb}\nDIRECT_URL=${developmentDb}\n`,
      ".env.e2e.local": `DATABASE_URL=${fileE2EDb}\nDIRECT_URL=${fileE2EDb}\nE2E=false\nNODE_ENV=test\n`,
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(databaseImportMarker));
  assert.deepEqual(JSON.parse(result.stdout.trim().split("\n").at(-1) ?? ""), {
    databaseUrl: fileE2EDb,
    directUrl: fileE2EDb,
    e2e: "true",
    nodeEnv: "production",
  });
});

test("E2E seed requires E2E mode to be injected even when the file declares it", async (t) => {
  const result = await runSeed(
    t,
    "seed-e2e.ts",
    {},
    { ".env.e2e.local": `DATABASE_URL=${fileE2EDb}\nDIRECT_URL=${fileE2EDb}\nE2E=true\n` },
  );

  assertRejectedBeforeDatabaseImport(result);
  assert.match(result.stderr, /E2E/);
});

test("E2E seed rejects missing, non-E2E, mismatched and hosted targets before database import", async (t) => {
  for (const input of [
    { DATABASE_URL: fileE2EDb },
    { DATABASE_URL: developmentDb, DIRECT_URL: fileE2EDb },
    { DATABASE_URL: fileE2EDb, DIRECT_URL: developmentDb },
    { DATABASE_URL: fileE2EDb, DIRECT_URL: injectedE2EDb },
    { DATABASE_URL: fileE2EDb, DIRECT_URL: fileE2EDb, VERCEL_ENV: "preview" },
  ]) {
    const result = await runSeed(t, "seed-e2e.ts", { E2E: "true", ...input });
    assertRejectedBeforeDatabaseImport(result);
    assert.match(result.stderr, /E2E|DATABASE_URL|DIRECT_URL|vercel/i);
  }
});
