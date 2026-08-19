import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  findWorkspaceAppNames,
  findWorkspaceRoot,
  syncDesignSystemTargetBarrels,
  toKebabCase,
  toPascalCase,
} from "../utils";

interface GenerateComponentParams {
  name: string;
  args: string[];
}

interface ComponentGeneratorOptions {
  name: string;
  category: string;
  target: string;
  force: boolean;
}

interface ParsedFlag {
  key: string;
  value: string | true;
}

interface ComponentTemplateParams {
  componentName: string;
  kebabName: string;
}

interface StoryTemplateParams extends ComponentTemplateParams {
  category: string;
  target: string;
}

interface GeneratedFile {
  filePath: string;
  content: string;
}

const allowedFlags = new Set(["target", "category", "force"]);

function parseFlag(value: string, nextValue: string | undefined): ParsedFlag {
  if (!value.startsWith("--")) {
    throw new Error(`[component] invalid option format: ${value}`);
  }

  const normalized = value.slice(2);

  const [key, inlineValue] = normalized.split("=");

  if (!key) {
    throw new Error(`[component] invalid option name: ${value}`);
  }

  if (!allowedFlags.has(key)) {
    throw new Error(`[component] unsupported option: --${key}`);
  }

  if (inlineValue !== undefined) {
    return {
      key,
      value: inlineValue,
    };
  }

  if (key === "force") {
    return {
      key,
      value: true,
    };
  }

  if (!nextValue || nextValue.startsWith("--")) {
    return {
      key,
      value: true,
    };
  }

  return {
    key,
    value: nextValue,
  };
}

function parseOptions(params: GenerateComponentParams): ComponentGeneratorOptions {
  const { name, args } = params;

  const flags = new Map<string, string | true>();

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (!current) {
      continue;
    }

    const next = args[index + 1];

    const parsed = parseFlag(current, next);

    flags.set(parsed.key, parsed.value);

    if (parsed.value !== true && parsed.value === next) {
      index += 1;
    }
  }

  const rawTarget = flags.get("target");
  const rawCategory = flags.get("category");

  if (typeof rawTarget !== "string") {
    throw new Error("[component] --target is required. Example: --target admin");
  }

  if (typeof rawCategory !== "string") {
    throw new Error("[component] --category is required. Example: --category inputs");
  }

  const kebabName = toKebabCase(name);
  const category = toKebabCase(rawCategory);
  const target = rawTarget === "all" ? "all" : toKebabCase(rawTarget);

  if (!kebabName) {
    throw new Error("[component] component name is invalid.");
  }

  if (!category) {
    throw new Error("[component] category is invalid.");
  }

  if (!target) {
    throw new Error("[component] target is invalid.");
  }

  return {
    name: kebabName,
    category,
    target,
    force: flags.has("force"),
  };
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);

    return true;
  } catch {
    return false;
  }
}

async function resolveTargets(params: {
  workspaceRoot: string;
  target: string;
}): Promise<string[]> {
  const { workspaceRoot, target } = params;

  const appNames = await findWorkspaceAppNames(workspaceRoot);

  if (appNames.length === 0) {
    throw new Error("[component] no applications were found in apps/.");
  }

  if (target === "all") {
    return appNames;
  }

  if (!appNames.includes(target)) {
    throw new Error(
      [
        `[component] unknown app target: ${target}`,
        `Available targets: ${appNames.join(", ")}`,
      ].join("\n"),
    );
  }

  return [target];
}

function createComponentTemplate(params: ComponentTemplateParams): string {
  const { componentName } = params;

  return `import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../utils";

type ${componentName}Props = ComponentPropsWithRef<"div">;

export function ${componentName}({
  className,
  ...props
}: ${componentName}Props) {
  return <div className={cn(className)} {...props} />;
}
`;
}

function createComponentTestTemplate(params: ComponentTemplateParams): string {
  const { componentName, kebabName } = params;

  return `import { render, screen } from "@testing-library/react";

import { ${componentName} } from "./${kebabName}";

describe("${componentName}", () => {
  it("children을 렌더링한다", () => {
    render(<${componentName}>Content</${componentName}>);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("className을 적용한다", () => {
    render(
      <${componentName} className="custom-class">
        Content
      </${componentName}>,
    );

    expect(screen.getByText("Content")).toHaveClass("custom-class");
  });
});
`;
}

function createComponentStoryTemplate(params: StoryTemplateParams): string {
  const { componentName, kebabName, category, target } = params;

  const storyTarget = toPascalCase(target);
  const storyCategory = toPascalCase(category);

  return `import type { Meta, StoryObj } from "@storybook/react-vite";

import { ${componentName} } from "./${kebabName}";

const meta: Meta<typeof ${componentName}> = {
  title: "${storyTarget}/${storyCategory}/${componentName}",
  component: ${componentName},
  args: {
    children: "${componentName}",
  },
};

export default meta;

type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {};
`;
}

function createComponentIndexTemplate(params: ComponentTemplateParams): string {
  const { componentName, kebabName } = params;

  return `export { ${componentName} } from "./${kebabName}";
`;
}

function createGeneratedFiles(params: {
  componentDir: string;
  componentName: string;
  kebabName: string;
  category: string;
  target: string;
}): GeneratedFile[] {
  const { componentDir, componentName, kebabName, category, target } = params;

  return [
    {
      filePath: path.join(componentDir, `${kebabName}.tsx`),
      content: createComponentTemplate({
        componentName,
        kebabName,
      }),
    },
    {
      filePath: path.join(componentDir, `${kebabName}.test.tsx`),
      content: createComponentTestTemplate({
        componentName,
        kebabName,
      }),
    },
    {
      filePath: path.join(componentDir, `${kebabName}.stories.tsx`),
      content: createComponentStoryTemplate({
        componentName,
        kebabName,
        category,
        target,
      }),
    },
    {
      filePath: path.join(componentDir, "index.ts"),
      content: createComponentIndexTemplate({
        componentName,
        kebabName,
      }),
    },
  ];
}

async function assertGeneratedFilesCanBeWritten(
  files: GeneratedFile[],
  force: boolean,
): Promise<void> {
  if (force) {
    return;
  }

  const existingFiles: string[] = [];

  for (const file of files) {
    if (await exists(file.filePath)) {
      existingFiles.push(file.filePath);
    }
  }

  if (existingFiles.length === 0) {
    return;
  }

  throw new Error(
    [
      "[component] generated files already exist:",
      ...existingFiles.map((filePath) => `- ${filePath}`),
      "Use --force to overwrite them.",
    ].join("\n"),
  );
}

async function writeGeneratedFiles(files: GeneratedFile[]): Promise<void> {
  for (const file of files) {
    await mkdir(path.dirname(file.filePath), {
      recursive: true,
    });

    await writeFile(file.filePath, file.content);
  }
}

export async function generateComponent(params: GenerateComponentParams): Promise<void> {
  const options = parseOptions(params);

  const workspaceRoot = await findWorkspaceRoot();

  const designSystemSrcPath = path.join(workspaceRoot, "packages", "design-system", "src");

  const targets = await resolveTargets({
    workspaceRoot,
    target: options.target,
  });

  const componentName = toPascalCase(options.name);

  const generations = targets.map((target) => {
    const targetPath = path.join(designSystemSrcPath, target);

    const componentDir = path.join(targetPath, options.category, options.name);

    return {
      target,
      targetPath,
      files: createGeneratedFiles({
        componentDir,
        componentName,
        kebabName: options.name,
        category: options.category,
        target,
      }),
    };
  });

  await assertGeneratedFilesCanBeWritten(
    generations.flatMap((generation) => generation.files),
    options.force,
  );

  for (const generation of generations) {
    await writeGeneratedFiles(generation.files);

    await syncDesignSystemTargetBarrels({
      targetPath: generation.targetPath,
      category: options.category,
    });

    console.info(`[component] created ${generation.target} component: ${componentName}`);
  }
}
