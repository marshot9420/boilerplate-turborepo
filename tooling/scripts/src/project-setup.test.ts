import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test, type TestContext } from "node:test";

import { collectProjectTextFiles, replaceProjectText } from "./project-setup.ts";

const LOCAL_ENV_MARKER = "fixture-only-local-env";

const editableFiles = {
  ".env.example": "PROJECT_NAME=boilerplate-turborepo\n",
  ".env.test.example": "DATABASE_NAME=boilerplate-turborepo-test\n",
  ".env.e2e.example": "DATABASE_NAME=boilerplate-turborepo-e2e\n",
  ".npmrc": "@repo:registry=https://example.invalid\n",
  "package.json": '{ "name": "boilerplate-turborepo" }\n',
  "pnpm-workspace.yaml": 'packages:\n  - "apps/*"\n',
  "apps/web/src/config.ts": 'export const projectName = "boilerplate-turborepo";\n',
};

const localEnvFiles = Object.fromEntries(
  [
    ".env",
    ".env.local",
    ".env.test.local",
    ".env.e2e.local",
    ".env.production",
    ".env.production.local",
    ".env.custom.example",
    ".env.local.json",
    ".env.local.ts",
    ".env.example.json",
    "apps/web/.env.local",
  ].map((filePath) => [
    filePath,
    `${LOCAL_ENV_MARKER}=${filePath}\r\nPROJECT_NAME=boilerplate-turborepo\r\n`,
  ]),
);

const ignoredFiles = Object.fromEntries(
  [
    "pnpm-lock.yaml",
    ".git/config.json",
    ".next/config.json",
    ".turbo/config.json",
    "coverage/config.json",
    "dist/config.json",
    "node_modules/example/config.json",
    "out/config.json",
    "apps/web/.next/config.json",
    "image.png",
  ].map((filePath) => [filePath, "boilerplate-turborepo\n"]),
);

const fixtureFiles = { ...editableFiles, ...localEnvFiles, ...ignoredFiles };

async function buildProjectFixture(t: TestContext): Promise<string> {
  const rootPath = await mkdtemp(path.join(tmpdir(), "project-setup-test-"));

  t.after(async () => {
    await rm(rootPath, { recursive: true, force: true });
  });

  for (const [relativePath, content] of Object.entries(fixtureFiles)) {
    const filePath = path.join(rootPath, relativePath);

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content);
  }

  return rootPath;
}

function renameProject(content: string): string {
  return content.replaceAll("boilerplate-turborepo", "buyer-project").replaceAll("@repo", "@buyer");
}

test("collects project sources and the three environment examples while excluding local files and generated output", async (t) => {
  const rootPath = await buildProjectFixture(t);

  const files = await collectProjectTextFiles(rootPath);

  assert.deepEqual(
    files.map((filePath) => path.relative(rootPath, filePath)).sort(),
    Object.keys(editableFiles).sort(),
  );
});

test("renames project references without exposing or changing existing local environment files", async (t) => {
  const rootPath = await buildProjectFixture(t);
  const transformedContents: string[] = [];

  const result = await replaceProjectText({
    rootPath,
    dryRun: false,
    transform(content) {
      transformedContents.push(content);

      return renameProject(content);
    },
  });

  for (const [relativePath, content] of Object.entries(editableFiles)) {
    assert.equal(await readFile(path.join(rootPath, relativePath), "utf8"), renameProject(content));
  }

  for (const [relativePath, content] of Object.entries({ ...localEnvFiles, ...ignoredFiles })) {
    assert.deepEqual(
      await readFile(path.join(rootPath, relativePath)),
      Buffer.from(content),
      relativePath,
    );
  }

  assert.equal(
    transformedContents.some((content) => content.includes(LOCAL_ENV_MARKER)),
    false,
    "local environment contents must never reach the transform callback",
  );

  const changedFiles = Object.entries(editableFiles)
    .filter(([, content]) => content !== renameProject(content))
    .map(([relativePath]) => relativePath)
    .sort((a, b) => a.localeCompare(b));

  assert.deepEqual(result, {
    checkedFileCount: Object.keys(editableFiles).length,
    changedFileCount: changedFiles.length,
    changedFiles,
  });
});

test("dry run reports intended changes while leaving every fixture file byte-identical", async (t) => {
  const rootPath = await buildProjectFixture(t);

  const result = await replaceProjectText({
    rootPath,
    dryRun: true,
    transform: renameProject,
  });

  for (const [relativePath, content] of Object.entries(fixtureFiles)) {
    assert.deepEqual(
      await readFile(path.join(rootPath, relativePath)),
      Buffer.from(content),
      relativePath,
    );
  }

  assert.deepEqual(
    result.changedFiles,
    Object.entries(editableFiles)
      .filter(([, content]) => content !== renameProject(content))
      .map(([relativePath]) => relativePath)
      .sort((a, b) => a.localeCompare(b)),
  );
});
