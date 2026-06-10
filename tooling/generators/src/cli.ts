import { availableGenerators } from "./generators";

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

  console.info("[generators] received request", {
    type,
    name,
  });

  console.info("[generators] generator implementation is not ready yet.");
}

await main();
