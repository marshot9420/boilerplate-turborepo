import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

interface BarrelExports {
  runtime: string[];
  types: string[];
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);

    return true;
  } catch {
    return false;
  }
}

function extractRuntimeExportNames(content: string): string[] {
  const exportNames = new Set<string>();

  const namedExportPattern = /export\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["'];?/g;

  for (const match of content.matchAll(namedExportPattern)) {
    const rawSpecifiers = match[1];

    if (!rawSpecifiers) {
      continue;
    }

    for (const rawSpecifier of rawSpecifiers.split(",")) {
      const specifier = rawSpecifier.trim();

      if (!specifier || specifier.startsWith("type ")) {
        continue;
      }

      const aliasParts = specifier.split(/\s+as\s+/);
      const exportedName = aliasParts.at(-1)?.trim();

      if (exportedName) {
        exportNames.add(exportedName);
      }
    }
  }

  return [...exportNames].sort((a, b) => a.localeCompare(b));
}

function extractTypeExportNames(content: string): string[] {
  const exportNames = new Set<string>();

  const typeExportPattern = /export\s+type\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["'];?/g;

  for (const match of content.matchAll(typeExportPattern)) {
    const rawSpecifiers = match[1];

    if (!rawSpecifiers) {
      continue;
    }

    for (const rawSpecifier of rawSpecifiers.split(",")) {
      const specifier = rawSpecifier.trim();

      if (!specifier) {
        continue;
      }

      const aliasParts = specifier.split(/\s+as\s+/);
      const exportedName = aliasParts.at(-1)?.trim();

      if (exportedName) {
        exportNames.add(exportedName);
      }
    }
  }

  const namedExportPattern = /export\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["'];?/g;

  for (const match of content.matchAll(namedExportPattern)) {
    const rawSpecifiers = match[1];

    if (!rawSpecifiers) {
      continue;
    }

    for (const rawSpecifier of rawSpecifiers.split(",")) {
      const specifier = rawSpecifier.trim();

      if (!specifier.startsWith("type ")) {
        continue;
      }

      const typeSpecifier = specifier.slice("type ".length).trim();
      const aliasParts = typeSpecifier.split(/\s+as\s+/);
      const exportedName = aliasParts.at(-1)?.trim();

      if (exportedName) {
        exportNames.add(exportedName);
      }
    }
  }

  return [...exportNames].sort((a, b) => a.localeCompare(b));
}

function extractReExportModulePaths(content: string): string[] {
  const modulePaths = new Set<string>();

  const exportAllPattern = /export\s+\*\s+from\s*["']([^"']+)["'];?/g;
  const namedExportPattern = /export\s+(?:type\s+)?\{[\s\S]*?\}\s*from\s*["']([^"']+)["'];?/g;

  for (const match of content.matchAll(exportAllPattern)) {
    const modulePath = match[1];

    if (modulePath) {
      modulePaths.add(modulePath);
    }
  }

  for (const match of content.matchAll(namedExportPattern)) {
    const modulePath = match[1];

    if (modulePath) {
      modulePaths.add(modulePath);
    }
  }

  return [...modulePaths].sort((a, b) => a.localeCompare(b));
}

function createNamedExportLine(exportNames: string[], modulePath: string): string {
  return `export { ${exportNames.join(", ")} } from "${modulePath}";`;
}

function createTypeExportLine(exportNames: string[], modulePath: string): string {
  return `export type { ${exportNames.join(", ")} } from "${modulePath}";`;
}

function createExportLines(exports: BarrelExports, modulePath: string): string[] {
  const lines: string[] = [];

  if (exports.types.length > 0) {
    lines.push(createTypeExportLine(exports.types, modulePath));
  }

  if (exports.runtime.length > 0) {
    lines.push(createNamedExportLine(exports.runtime, modulePath));
  }

  return lines;
}

async function syncCategoryBarrel(categoryPath: string): Promise<BarrelExports> {
  const entries = await readdir(categoryPath, {
    withFileTypes: true,
  });

  const componentDirectories = entries
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  const lines: string[] = [];
  const categoryRuntimeExportNames = new Set<string>();
  const categoryTypeExportNames = new Set<string>();

  for (const componentDirectory of componentDirectories) {
    const componentIndexPath = path.join(categoryPath, componentDirectory.name, "index.ts");

    if (!(await exists(componentIndexPath))) {
      continue;
    }

    const content = await readFile(componentIndexPath, "utf8");

    const exports: BarrelExports = {
      runtime: extractRuntimeExportNames(content),
      types: extractTypeExportNames(content),
    };

    if (exports.runtime.length === 0 && exports.types.length === 0) {
      continue;
    }

    for (const exportName of exports.runtime) {
      categoryRuntimeExportNames.add(exportName);
    }

    for (const exportName of exports.types) {
      categoryTypeExportNames.add(exportName);
    }

    lines.push(...createExportLines(exports, `./${componentDirectory.name}`));
  }

  await writeFile(
    path.join(categoryPath, "index.ts"),
    lines.length > 0 ? `${lines.join("\n")}\n` : "",
  );

  return {
    runtime: [...categoryRuntimeExportNames].sort((a, b) => a.localeCompare(b)),
    types: [...categoryTypeExportNames].sort((a, b) => a.localeCompare(b)),
  };
}

export async function syncDesignSystemTargetBarrels(params: {
  targetPath: string;
  category: string;
}): Promise<void> {
  const { targetPath, category } = params;

  const targetIndexPath = path.join(targetPath, "index.ts");

  let existingTargetIndex = "";

  if (await exists(targetIndexPath)) {
    existingTargetIndex = await readFile(targetIndexPath, "utf8");
  }

  const categoryModulePaths = new Set(
    extractReExportModulePaths(existingTargetIndex).filter((modulePath) =>
      /^\.\/[^/]+$/.test(modulePath),
    ),
  );

  categoryModulePaths.add(`./${category}`);

  const targetLines: string[] = [];

  for (const categoryModulePath of [...categoryModulePaths].sort((a, b) => a.localeCompare(b))) {
    const categoryName = categoryModulePath.slice(2);
    const categoryPath = path.join(targetPath, categoryName);

    if (!(await exists(categoryPath))) {
      continue;
    }

    const exports = await syncCategoryBarrel(categoryPath);

    if (exports.runtime.length === 0 && exports.types.length === 0) {
      continue;
    }

    targetLines.push(...createExportLines(exports, categoryModulePath));
  }

  await writeFile(targetIndexPath, targetLines.length > 0 ? `${targetLines.join("\n")}\n` : "");
}
