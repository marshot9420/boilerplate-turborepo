import {
  availableGenerators,
  generateComponent,
  generateDomain,
  generateEntity,
  generateFeature,
  generateView,
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

  pnpm generate feature update-profile --app web --domain user --ui update-profile-form
  pnpm generate feature register-order --app web --domain order --ui register-order-dialog
  pnpm generate feature logout --app admin --domain auth --ui logout-button

  pnpm generate view order-list-view --app admin --domain order
  pnpm generate view order-detail-view --app admin --domain order
  pnpm generate view my-profile-view --app web --domain user

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

  if (type === "view") {
    await generateView({
      name,
      args,
    });

    return;
  }

  console.error(`[generators] ${type} generator is not implemented yet.`);

  process.exitCode = 1;
}

await main();
