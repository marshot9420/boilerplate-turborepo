import { rm } from "node:fs/promises";
import path from "node:path";
import { setTimeout } from "node:timers/promises";

const ROOT_DIR = path.resolve(import.meta.dirname, "../../..");

const TARGETS = [
  ".turbo",
  "coverage",

  "apps/admin/.next",
  "apps/admin/.turbo",

  "apps/web/.next",
  "apps/web/.turbo",

  "packages/core/.turbo",
  "packages/env/.turbo",
  "packages/database/.turbo",
  "packages/design-system/.turbo",

  "tooling/scripts/.turbo",
] as const;

async function removeTarget(target: string) {
  const absolutePath = path.join(ROOT_DIR, target);

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await rm(absolutePath, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: 100,
      });

      console.info(`[clean] removed ${target}`);
      return;
    } catch (error) {
      if (attempt === 3) {
        throw error;
      }

      await setTimeout(150);
    }
  }
}

async function main() {
  for (const target of TARGETS) {
    await removeTarget(target);
  }

  console.info("[clean] done");
}

main().catch((error: unknown) => {
  console.error("[clean] failed", error);
  process.exitCode = 1;
});
