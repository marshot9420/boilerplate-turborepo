import {
  availableGenerators,
  generateComponent,
  generateDomain,
  generateEntity,
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

  pnpm generate entity order-status-badge --app admin --domain order
  pnpm generate entity product-card --app web --domain product

  pnpm generate feature content-status --app admin
  pnpm generate feature update-profile --app web

Entity options:
  --app <name>       Target application under apps/*
  --domain <name>    Entity domain Slice

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
    await generateDomain({
      name,
    });

    return;
  }

  if (type === "component") {
    await generateComponent({
      name,
      args,
    });

    return;
  }

  if (type === "entity") {
    await generateEntity({
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
