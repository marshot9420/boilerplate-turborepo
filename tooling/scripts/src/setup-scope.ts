import {
  findRepositoryRoot,
  normalizeScopeName,
  readCurrentScopeName,
  replaceProjectText,
  toScope,
  validateScopeName,
} from "./project-setup.ts";

interface ParsedArgs {
  toScopeName: string;
  fromScopeName?: string;
  dryRun: boolean;
}

function printHelp() {
  console.info(`
Usage:
  pnpm setup:scope <scope-name> [options]

Examples:
  pnpm setup:scope athena
  pnpm setup:scope athena --dry-run
  pnpm setup:scope eten --from athena
  pnpm setup:scope eten --from athena --dry-run

Options:
  --from <scope-name>
    Existing workspace package scope.
    Default: automatically detected from tooling/scripts/package.json.

  --dry-run
    Print files that would change without writing files.
`);
}

function readOptionValue(params: { args: string[]; index: number; optionName: string }): string {
  const { args, index, optionName } = params;

  const value = args[index + 1];

  if (!value || value.startsWith("--")) {
    throw new Error(`[setup:scope] ${optionName} option requires a value.`);
  }

  return value;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [rawToScopeName, ...args] = argv;

  if (!rawToScopeName) {
    throw new Error("[setup:scope] target scope name is required.");
  }

  const toScopeName = normalizeScopeName(rawToScopeName);

  let fromScopeName: string | undefined;

  let dryRun = false;

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (!current) {
      continue;
    }

    if (current === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (current === "--from") {
      fromScopeName = normalizeScopeName(
        readOptionValue({
          args,
          index,
          optionName: "--from",
        }),
      );

      index += 1;
      continue;
    }

    if (current.startsWith("--from=")) {
      const [, value] = current.split("=");

      if (!value) {
        throw new Error("[setup:scope] --from option requires a value.");
      }

      fromScopeName = normalizeScopeName(value);

      continue;
    }

    throw new Error(`[setup:scope] unknown option: ${current}`);
  }

  validateScopeName(toScopeName);

  if (fromScopeName) {
    validateScopeName(fromScopeName);
  }

  return {
    toScopeName,
    fromScopeName,
    dryRun,
  };
}

function printResult(params: {
  checkedFileCount: number;
  changedFileCount: number;
  changedFiles: string[];
  fromScopeName: string;
  toScopeName: string;
  dryRun: boolean;
}): void {
  const { checkedFileCount, changedFileCount, changedFiles, fromScopeName, toScopeName, dryRun } =
    params;

  const title = dryRun ? "[setup:scope] dry run completed" : "[setup:scope] completed";

  console.info(
    [
      title,
      `scope: ${toScope(fromScopeName)} -> ${toScope(toScopeName)}`,
      `checked files: ${checkedFileCount}`,
      `changed files: ${changedFileCount}`,
    ].join("\n"),
  );

  if (changedFiles.length > 0) {
    console.info(
      [
        "",
        dryRun ? "Files to change:" : "Changed files:",
        ...changedFiles.map((filePath) => `  ${filePath}`),
      ].join("\n"),
    );
  }

  if (dryRun) {
    console.info(
      ["", "No files were written.", "Run without --dry-run to apply these changes."].join("\n"),
    );

    return;
  }

  console.info(["", "Next steps:", "  pnpm install", "  pnpm format", "  pnpm check"].join("\n"));
}

async function main() {
  try {
    const parsedArgs = parseArgs(process.argv.slice(2));

    const rootPath = await findRepositoryRoot(process.cwd());

    const fromScopeName = parsedArgs.fromScopeName ?? (await readCurrentScopeName(rootPath));

    validateScopeName(fromScopeName);

    if (fromScopeName === parsedArgs.toScopeName) {
      throw new Error(
        `[setup:scope] current scope and target scope are the same: ${toScope(parsedArgs.toScopeName)}`,
      );
    }

    const result = await replaceProjectText({
      rootPath,
      dryRun: parsedArgs.dryRun,
      transform: (content) =>
        content.replaceAll(toScope(fromScopeName), toScope(parsedArgs.toScopeName)),
    });

    printResult({
      ...result,
      fromScopeName,
      toScopeName: parsedArgs.toScopeName,
      dryRun: parsedArgs.dryRun,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      printHelp();
      process.exitCode = 1;

      return;
    }

    console.error(error);
    process.exitCode = 1;
  }
}

await main();
