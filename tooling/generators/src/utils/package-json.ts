import { readFile, writeFile } from "node:fs/promises";

import { logger } from "./logger";

export interface AddPackageExportOptions {
  packageJsonPath: string;
  exportPath: string;
  targetPath: string;
}

interface PackageJson {
  exports?: Record<string, string>;
}

export async function addPackageExport(options: AddPackageExportOptions) {
  const { packageJsonPath, exportPath, targetPath } = options;

  const raw = await readFile(packageJsonPath, "utf8");

  const packageJson = JSON.parse(raw) as PackageJson;

  packageJson.exports ??= {};

  if (packageJson.exports[exportPath]) {
    logger.warn("package_export.skipped", {
      exportPath,
      reason: "already exists",
    });

    return;
  }

  packageJson.exports[exportPath] = targetPath;

  const sortedExports = Object.entries(packageJson.exports)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  packageJson.exports = sortedExports;

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

  logger.info("package_export.created", {
    exportPath,
  });
}
