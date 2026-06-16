import { availableGenerators, generateDomain, isGeneratorType } from "./generators";

function printHelp() {
  console.info(`
Usage:
  pnpm --filter @repo/generators generate <type> <name>

Examples:
  pnpm --filter @repo/generators generate domain content

Available generators:
  ${availableGenerators.join(", ")}
`);
}

async function main() {
  const [, , type, name] = process.argv;

  if (!type || !name) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  if (!isGeneratorType(type)) {
    console.error(`[generators] unsupported generator type: ${type}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  if (type === "domain") {
    await generateDomain({ name });
    return;
  }

  console.error(`[generators] ${type} generator is not implemented yet.`);
  process.exitCode = 1;
}

await main();
