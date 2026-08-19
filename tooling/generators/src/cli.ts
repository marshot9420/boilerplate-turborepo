import {
  availableGenerators,
  generateComponent,
  generateDomain,
  generateFeature,
  isGeneratorType,
} from "./generators";

function printHelp() {
  console.info(`
Usage:
  pnpm generate <type> <name> [options]

Examples:
  pnpm generate domain content

  pnpm generate component empty-state --target all --category feedback
  pnpm generate component phone-input --target web --category inputs
  pnpm generate component field --target admin --category form
  pnpm generate component navigation-item --target web --category navigation

  pnpm generate feature content-status --app admin
  pnpm generate feature update-profile --app web

Available generators:
  ${availableGenerators.join(", ")}
`);
}

async function main() {
  const [, , type, name, ...args] = process.argv;

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

  if (type === "component") {
    await generateComponent({
      name,
      args,
    });

    return;
  }

  if (type === "feature") {
    await generateFeature({
      name,
      args,
    });

    return;
  }

  console.error(`[generators] ${type} generator is not implemented yet.`);

  process.exitCode = 1;
}

await main();
