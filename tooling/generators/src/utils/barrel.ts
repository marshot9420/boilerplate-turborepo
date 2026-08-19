import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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

async function syncCategoryBarrel(categoryPath: string): Promise<string[]> {
  const entries = await readdir(categoryPath, {
    withFileTypes: true,
  });

  const componentDirectories = entries
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  const lines: string[] = [];
  const categoryExportNames = new Set<string>();

  for (const componentDirectory of componentDirectories) {
    const componentIndexPath = path.join(categoryPath, componentDirectory.name, "index.ts");

    if (!(await exists(componentIndexPath))) {
      continue;
    }

    const content = await readFile(componentIndexPath, "utf8");

    const exportNames = extractRuntimeExportNames(content);

    if (exportNames.length === 0) {
      continue;
    }

    for (const exportName of exportNames) {
      categoryExportNames.add(exportName);
    }

    lines.push(createNamedExportLine(exportNames, `./${componentDirectory.name}`));
  }

  await writeFile(path.join(categoryPath, "index.ts"), `${lines.join("\n")}\n`);

  return [...categoryExportNames].sort((a, b) => a.localeCompare(b));
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

    const exportNames = await syncCategoryBarrel(categoryPath);

    if (exportNames.length === 0) {
      continue;
    }

    targetLines.push(createNamedExportLine(exportNames, categoryModulePath));
  }

  await writeFile(targetIndexPath, `${targetLines.join("\n")}\n`);
}
