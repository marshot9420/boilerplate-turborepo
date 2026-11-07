import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const packageDir = fileURLToPath(new URL("../../", import.meta.url));
const prismaCli = fileURLToPath(import.meta.resolve("prisma/build/index.js"));
const resultMarker = "PRISMA_CONFIG_TEST_RESULT=";

function databaseUrl(database: string, protocol = "postgresql") {
  return `${protocol}://fixture:fixture-secret@db.example.invalid:5432/${database}`;
}

function runConfig({
  deploy = false,
  env = {},
  files = {},
}: {
  deploy?: boolean;
  env?: NodeJS.ProcessEnv;
  files?: Record<string, string>;
} = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "prisma-config-test-"));
  const fixturePackage = path.join(root, "packages", "database");

  try {
    cpSync(packageDir, fixturePackage, {
      recursive: true,
      filter(source) {
        const name = path.basename(source);
        return !name.startsWith(".env") && !["node_modules", "dist", ".turbo"].includes(name);
      },
    });
    symlinkSync(
      path.join(packageDir, "node_modules"),
      path.join(fixturePackage, "node_modules"),
      "junction",
    );
    writeFileSync(path.join(root, "pnpm-workspace.yaml"), "packages:\n  - 'packages/*'\n");
    for (const [name, value] of Object.entries(files)) {
      writeFileSync(path.join(root, name), value);
    }

    // The probe loads the same config through Prisma's real CLI. Validation does not connect to PostgreSQL.
    const configName = deploy ? "prisma.deploy.config.ts" : "prisma.config.ts";
    writeFileSync(
      path.join(fixturePackage, "probe.config.ts"),
      `import config from "./${configName}";
console.log(${JSON.stringify(resultMarker)} + JSON.stringify({
  url: config.datasource?.url,
  databaseUrl: process.env.DATABASE_URL,
  probe: process.env.CONFIG_PROBE,
  nodeEnv: process.env.NODE_ENV,
  e2e: process.env.E2E,
  vercelEnv: process.env.VERCEL_ENV,
}));
export default config;
`,
    );

    const result = spawnSync(
      process.execPath,
      [prismaCli, "validate", "--config", "probe.config.ts"],
      {
        cwd: fixturePackage,
        env: { NO_COLOR: "1", PRISMA_HIDE_UPDATE_MESSAGE: "1", ...env },
        encoding: "utf8",
        timeout: 10_000,
      },
    );
    if (result.error) throw result.error;

    const output = result.stdout + result.stderr;
    const markerLine = output.split(/\r?\n/).find((line) => line.startsWith(resultMarker));
    return {
      status: result.status,
      output,
      config: markerLine ? JSON.parse(markerLine.slice(resultMarker.length)) : undefined,
    };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function expectConfig(result: ReturnType<typeof runConfig>, expected: object) {
  expect(result.status, result.output).toBe(0);
  expect(result.config).toEqual(expect.objectContaining(expected));
}

function expectRejected(result: ReturnType<typeof runConfig>, message: RegExp) {
  expect(result.status, result.output).toBe(1);
  expect(result.config).toBeUndefined();
  expect(result.output).toMatch(message);
  expect(result.output).not.toContain("fixture-secret");
}

describe("Prisma local configuration", { timeout: 35_000 }, () => {
  const localFiles = {
    ".env": `DIRECT_URL=${databaseUrl("base")}\nCONFIG_PROBE=base`,
    ".env.local": `DIRECT_URL=${databaseUrl("local")}\nCONFIG_PROBE=local`,
  };

  it("preserves a process-injected DIRECT_URL during a local production build", () => {
    const url = databaseUrl("injected");
    expectConfig(
      runConfig({ env: { NODE_ENV: "production", DIRECT_URL: url }, files: localFiles }),
      {
        url,
        probe: "local",
        nodeEnv: "production",
      },
    );
  });

  it("uses .env.local before .env when the process does not supply a local value", () => {
    expectConfig(runConfig({ env: { NODE_ENV: "production" }, files: localFiles }), {
      url: databaseUrl("local"),
      probe: "local",
    });
    expectConfig(runConfig({ files: { ".env": localFiles[".env"] } }), {
      url: databaseUrl("base"),
      probe: "base",
    });
  });

  it("rejects a blank injected DIRECT_URL even when a file has a value", () => {
    expectRejected(runConfig({ env: { DIRECT_URL: "" }, files: localFiles }), /DIRECT_URL/);
  });

  it("prevents a file from selecting a different execution environment", () => {
    const result = runConfig({
      env: { NODE_ENV: "development" },
      files: {
        ...localFiles,
        ".env.local": `${localFiles[".env.local"]}\nE2E=true\nNODE_ENV=test\nVERCEL_ENV=preview`,
      },
    });
    expectConfig(result, { url: databaseUrl("local"), nodeEnv: "development" });
    expect(result.config).not.toHaveProperty("e2e");
    expect(result.config).not.toHaveProperty("vercelEnv");
  });

  it("selects dedicated Test files, with .env.test.local overriding the process", () => {
    const env = {
      NODE_ENV: "test",
      DIRECT_URL: databaseUrl("injected_test"),
      CONFIG_PROBE: "injected",
    };
    const files = {
      ...localFiles,
      ".env.test": `DIRECT_URL=${databaseUrl("base_test")}\nCONFIG_PROBE=base-test`,
      ".env.test.local": `DIRECT_URL=${databaseUrl("local_test")}\nCONFIG_PROBE=local-test`,
    };
    expectConfig(runConfig({ env, files }), {
      url: databaseUrl("local_test"),
      probe: "local-test",
    });
    expectConfig(runConfig({ env, files: { ".env.test": files[".env.test"] } }), {
      url: databaseUrl("injected_test"),
      probe: "injected",
    });
    expectConfig(
      runConfig({ env: { NODE_ENV: "test" }, files: { ".env.test": files[".env.test"] } }),
      {
        url: databaseUrl("base_test"),
        probe: "base-test",
      },
    );
    expectRejected(runConfig({ env: { NODE_ENV: "test" }, files: localFiles }), /DIRECT_URL/);
  });

  it("keeps E2E active in a production build and gives .env.e2e.local highest priority", () => {
    const env = { NODE_ENV: "production", E2E: "true", DIRECT_URL: databaseUrl("injected_e2e") };
    const url = databaseUrl("local_e2e");
    const poolUrl = url.replace("db.example.invalid", "pool.example.invalid");
    expectConfig(
      runConfig({
        env,
        files: { ...localFiles, ".env.e2e.local": `DIRECT_URL=${url}\nDATABASE_URL=${poolUrl}` },
      }),
      { url, databaseUrl: poolUrl, nodeEnv: "production", e2e: "true", probe: "local" },
    );
    expectConfig(runConfig({ env: { ...env, CONFIG_PROBE: "injected" }, files: localFiles }), {
      url: databaseUrl("injected_e2e"),
      probe: "injected",
    });
  });

  it.each([
    ["test", { NODE_ENV: "test" }],
    ["e2e", { E2E: "true" }],
  ])("rejects non-dedicated %s DB targets", (suffix, env) => {
    expectRejected(
      runConfig({ env: { ...env, DIRECT_URL: databaseUrl("production") } }),
      /DIRECT_URL/,
    );
    expectRejected(
      runConfig({
        env: {
          ...env,
          DIRECT_URL: databaseUrl(`local_${suffix}`),
          DATABASE_URL: databaseUrl("production"),
        },
      }),
      /DATABASE_URL/,
    );
  });

  it.each([
    ["test", { NODE_ENV: "test" }],
    ["e2e", { E2E: "true" }],
  ])("rejects different dedicated database names in %s mode", (suffix, env) => {
    expectRejected(
      runConfig({
        env: {
          ...env,
          DIRECT_URL: databaseUrl(`direct_${suffix}`),
          DATABASE_URL: databaseUrl(`runtime_${suffix}`),
        },
      }),
      /DATABASE_URL.*DIRECT_URL/,
    );
  });

  it.each(["production/fixture_test", "production%3Ffixture_test"])(
    "rejects an ambiguous database path %s before using the suffix guard",
    (database) => {
      expectRejected(
        runConfig({ env: { NODE_ENV: "test", DIRECT_URL: databaseUrl(database) } }),
        /DIRECT_URL/,
      );
    },
  );

  it.each(["preview", "production"])("uses only platform variables on Vercel %s", (vercelEnv) => {
    const url = databaseUrl("injected");
    const result = runConfig({
      env: { NODE_ENV: "production", VERCEL_ENV: vercelEnv, DIRECT_URL: url },
      files: localFiles,
    });
    expectConfig(result, { url, vercelEnv });
    expect(result.config).not.toHaveProperty("probe");
    expectRejected(runConfig({ env: { VERCEL_ENV: vercelEnv }, files: localFiles }), /DIRECT_URL/);
  });

  it.each([{ NODE_ENV: "test" }, { E2E: "true" }])(
    "rejects Test and E2E modes on Vercel",
    (mode) => {
      expectRejected(
        runConfig({
          env: { ...mode, VERCEL_ENV: "preview", DIRECT_URL: databaseUrl("cloud_e2e") },
        }),
        /Vercel|Preview|Production/i,
      );
    },
  );
});

describe("Prisma deployment configuration", { timeout: 15_000 }, () => {
  const files = { ".env.local": `DIRECT_URL=${databaseUrl("local")}\nCONFIG_PROBE=local` };

  it.each(["postgresql", "postgres"])(
    "uses a valid %s process URL with no NODE_ENV",
    (protocol) => {
      const url = databaseUrl("injected", protocol);
      const result = runConfig({ deploy: true, env: { DIRECT_URL: url }, files });
      expectConfig(result, { url });
      expect(result.config).not.toHaveProperty("probe");
      expect(result.config).not.toHaveProperty("nodeEnv");
    },
  );

  it.each([undefined, "", "not-a-url-fixture-secret", "https://fixture-secret@example.invalid/db"])(
    "rejects a missing or invalid DIRECT_URL despite the local fallback",
    (url) => {
      expectRejected(runConfig({ deploy: true, env: { DIRECT_URL: url }, files }), /DIRECT_URL/);
    },
  );

  it.each([{ NODE_ENV: "test" }, { E2E: "true" }, { VERCEL_ENV: "development" }])(
    "rejects non-deployment context %j",
    (env) => {
      expectRejected(
        runConfig({ deploy: true, env: { ...env, DIRECT_URL: databaseUrl("injected") }, files }),
        /test|e2e|development/i,
      );
    },
  );
});
