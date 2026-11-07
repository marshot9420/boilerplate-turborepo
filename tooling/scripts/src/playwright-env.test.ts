import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test, type TestContext } from "node:test";

const workspaceUrl = new URL("../../../", import.meta.url);
const loaderUrl = new URL("packages/playwright-config/load-env.ts", workspaceUrl);
const injectedDb = "postgresql://fixture@localhost/injected_e2e";
const fileDb = "postgresql://fixture@localhost/file_e2e";

async function runLoader(
  t: TestContext,
  env: NodeJS.ProcessEnv,
  files: Record<string, string>,
  options: { app?: "web" | "admin"; playwright?: boolean } = {},
) {
  const root = await mkdtemp(path.join(tmpdir(), "playwright-env-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));

  const { app = "web", playwright = true } = options;
  const cwd = path.join(root, "apps", app);
  await mkdir(cwd, { recursive: true });
  await writeFile(path.join(root, "pnpm-workspace.yaml"), "packages: []\n");
  for (const [name, contents] of Object.entries(files)) {
    await writeFile(path.join(root, name), contents);
  }

  const nextConfigUrl = new URL(`apps/${app}/next.config.js`, workspaceUrl);
  const nextChild = `import { createRequire } from "node:module";
    const appRequire = createRequire(new URL(${JSON.stringify(nextConfigUrl.href)}));
    const nextRequire = createRequire(appRequire.resolve("next/package.json"));
    nextRequire("@next/env").loadEnvConfig(process.cwd(), process.env.NODE_ENV === "development");
    await import(${JSON.stringify(nextConfigUrl.href)});
    console.log(JSON.stringify({ e2e: process.env.E2E, nodeEnv: process.env.NODE_ENV, vercelEnv: process.env.VERCEL_ENV, databaseUrl: process.env.DATABASE_URL, directUrl: process.env.DIRECT_URL, baseOnly: process.env.BASE_ONLY }));`;
  const source = playwright
    ? `import { loadPlaywrightEnv } from ${JSON.stringify(loaderUrl.href)};
       import { spawnSync } from "node:child_process";
       loadPlaywrightEnv();
       const child = spawnSync(process.execPath, ["--input-type=module", "--eval", ${JSON.stringify(nextChild)}], { stdio: "inherit" });
       process.exitCode = child.status ?? 1;`
    : nextChild;
  const result = spawnSync(process.execPath, ["--input-type=module", "--eval", source], {
    cwd,
    env,
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.ifError(result.error);
  return result;
}

function readEnvironment(result: Awaited<ReturnType<typeof runLoader>>): unknown {
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout.trim().split("\n").at(-1) ?? "");
}

test("Playwright children inherit E2E mode and the E2E file's database in production builds", async (t) => {
  const result = await runLoader(
    t,
    { NODE_ENV: "production", DATABASE_URL: injectedDb, DIRECT_URL: injectedDb },
    {
      ".env": "BASE_ONLY=from-base\n",
      ".env.local": "DATABASE_URL=postgresql://fixture@localhost/local\n",
      ".env.e2e.local": `DATABASE_URL=${fileDb}\nDIRECT_URL=${fileDb}\nNODE_ENV=test\nE2E=false\nVERCEL_ENV=production\n`,
    },
  );

  assert.deepEqual(readEnvironment(result), {
    e2e: "true",
    nodeEnv: "production",
    databaseUrl: fileDb,
    directUrl: fileDb,
    baseOnly: "from-base",
  });
});

test("Playwright preserves an injected E2E database when the E2E file is absent", async (t) => {
  const result = await runLoader(
    t,
    { DATABASE_URL: injectedDb, DIRECT_URL: injectedDb },
    { ".env.local": `DATABASE_URL=${fileDb}\nDIRECT_URL=${fileDb}\n` },
  );

  assert.deepEqual(readEnvironment(result), {
    e2e: "true",
    databaseUrl: injectedDb,
    directUrl: injectedDb,
  });
});

for (const environment of ["preview", "production"]) {
  test(`Playwright rejects hosted ${environment} before launching a child`, async (t) => {
    const result = await runLoader(
      t,
      { VERCEL_ENV: environment, DATABASE_URL: injectedDb, DIRECT_URL: injectedDb },
      { ".env.e2e.local": `DATABASE_URL=${fileDb}\nDIRECT_URL=${fileDb}\n` },
    );

    assert.equal(result.status, 1);
    assert.match(result.stderr, /vercel|hosted/i);
    assert.doesNotMatch(result.stdout + result.stderr, /postgresql:\/\//);
  });
}

test("Playwright rejects missing, non-E2E and mismatched DB targets before the Next child", async (t) => {
  for (const env of [
    { DATABASE_URL: injectedDb },
    { DATABASE_URL: injectedDb, DIRECT_URL: "postgresql://fixture@localhost/development" },
    { DATABASE_URL: injectedDb, DIRECT_URL: fileDb },
  ]) {
    const result = await runLoader(t, env, {});
    assert.equal(result.status, 1);
    assert.match(result.stderr, /E2E|DATABASE_URL|DIRECT_URL/i);
    assert.equal(result.stdout.trim(), "");
    assert.doesNotMatch(result.stderr, /postgresql:\/\//);
  }
});

for (const app of ["web", "admin"] as const) {
  test(`${app} Next app-local files cannot select the E2E database overlay`, async (t) => {
    const result = await runLoader(
      t,
      { NODE_ENV: "production", DATABASE_URL: injectedDb, DIRECT_URL: injectedDb },
      {
        [`apps/${app}/.env.local`]: "E2E=true\n",
        ".env.e2e.local": `DATABASE_URL=${fileDb}\nDIRECT_URL=${fileDb}\n`,
      },
      { app, playwright: false },
    );
    assert.deepEqual(readEnvironment(result), {
      nodeEnv: "production",
      databaseUrl: injectedDb,
      directUrl: injectedDb,
    });
  });

  test(`${app} Next config preserves injected values and keeps the local production fallback`, async (t) => {
    const result = await runLoader(
      t,
      { NODE_ENV: "production", DATABASE_URL: injectedDb },
      {
        ".env.local": `DATABASE_URL=${fileDb}\nDIRECT_URL=${fileDb}\nNODE_ENV=test\nE2E=true\nVERCEL_ENV=preview\n`,
      },
      { app, playwright: false },
    );
    assert.deepEqual(readEnvironment(result), {
      nodeEnv: "production",
      databaseUrl: injectedDb,
      directUrl: fileDb,
    });
  });

  test(`${app} Next config does not use local files in Vercel Preview or Production`, async (t) => {
    for (const vercelEnv of ["preview", "production"]) {
      const result = await runLoader(
        t,
        { NODE_ENV: "production", VERCEL_ENV: vercelEnv, DATABASE_URL: injectedDb },
        {
          ".env.local": `DATABASE_URL=${fileDb}\nDIRECT_URL=${fileDb}\nBASE_ONLY=root-local\n`,
          [`apps/${app}/.env.local`]: `DATABASE_URL=${fileDb}\nDIRECT_URL=${fileDb}\nBASE_ONLY=app-local\n`,
        },
        { app, playwright: false },
      );
      assert.deepEqual(readEnvironment(result), {
        nodeEnv: "production",
        vercelEnv,
        databaseUrl: injectedDb,
      });
    }
  });
}
