import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { toCamelCase, toKebabCase, toPascalCase } from "../utils/string";

const componentTargets = ["primitive", "web", "admin", "all"] as const;

type ComponentTarget = (typeof componentTargets)[number];
type ResolvedComponentTarget = Exclude<ComponentTarget, "all">;

interface GenerateComponentParams {
  name: string;
  args: string[];
}

interface ComponentGeneratorOptions {
  name: string;
  category: string;
  target: ComponentTarget;
  primitiveName: string;
  force: boolean;
}

interface ParsedFlag {
  key: string;
  value: string | true;
}

interface ComponentTemplateParams {
  componentName: string;
  kebabName: string;
  category: string;
  target?: "web" | "admin";
  primitiveName?: string;
}

function isComponentTarget(value: string): value is ComponentTarget {
  return componentTargets.includes(value as ComponentTarget);
}

function parseFlag(value: string, nextValue: string | undefined): ParsedFlag {
  if (!value.startsWith("--")) {
    throw new Error(`[component] invalid option format: ${value}`);
  }

  const normalized = value.slice(2);
  const [key, inlineValue] = normalized.split("=");

  if (!key) {
    throw new Error(`[component] invalid option name: ${value}`);
  }

  if (inlineValue !== undefined) {
    return {
      key,
      value: inlineValue,
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
  const rawPrimitiveName = flags.get("primitive");

  if (typeof rawTarget !== "string" || !isComponentTarget(rawTarget)) {
    throw new Error(
      `[component] --target is required. Available values: ${componentTargets.join(", ")}`,
    );
  }

  if (typeof rawCategory !== "string") {
    throw new Error("[component] --category is required. Example: --category inputs");
  }

  const kebabName = toKebabCase(name);
  const category = toKebabCase(rawCategory);
  const primitiveName =
    typeof rawPrimitiveName === "string" ? toKebabCase(rawPrimitiveName) : kebabName;

  if (!kebabName) {
    throw new Error("[component] component name is invalid.");
  }

  if (!category) {
    throw new Error("[component] category is invalid.");
  }

  return {
    name: kebabName,
    category,
    target: rawTarget,
    primitiveName,
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

async function readTextFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return "";
    }

    throw error;
  }
}

async function writeGeneratedFile(params: {
  filePath: string;
  content: string;
  force: boolean;
}): Promise<void> {
  const { filePath, content, force } = params;
  const fileExists = await exists(filePath);

  if (fileExists && !force) {
    throw new Error(
      [`[component] file already exists: ${filePath}`, "Use --force to overwrite it."].join("\n"),
    );
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

async function ensureExportLine(filePath: string, exportLine: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });

  const currentContent = await readTextFile(filePath);

  if (currentContent.includes(exportLine)) {
    return;
  }

  const nextContent = currentContent.trimEnd()
    ? `${currentContent.trimEnd()}\n${exportLine}\n`
    : `${exportLine}\n`;

  await writeFile(filePath, nextContent);
}

function resolveTargets(target: ComponentTarget): ResolvedComponentTarget[] {
  if (target === "all") {
    return ["primitive", "web", "admin"];
  }

  return [target];
}

function createComponentIndexTemplate(params: {
  componentName: string;
  kebabName: string;
}): string {
  const { componentName, kebabName } = params;

  return `export { default as ${componentName} } from "./${kebabName}";
export type { ${componentName}Props } from "./${kebabName}";
`;
}

function createPrimitiveComponentTemplate(params: ComponentTemplateParams): string {
  const { componentName } = params;

  return `"use client";

import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../../utils";

export interface ${componentName}Props extends HTMLAttributes<HTMLDivElement> {
  invalid?: boolean;
}

const ${componentName} = forwardRef<HTMLDivElement, ${componentName}Props>(
  (
    {
      className,
      invalid = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(className)}
        data-invalid={invalid ? "true" : "false"}
        {...props}
      />
    );
  },
);

${componentName}.displayName = "${componentName}";

export default ${componentName};
`;
}

function createPrimitiveTestTemplate(params: ComponentTemplateParams): string {
  const { componentName, kebabName } = params;

  return `import { render, screen } from "@testing-library/react";

import ${componentName} from "./${kebabName}";

describe("Primitive ${componentName}", () => {
  it("children을 렌더링한다", () => {
    render(<${componentName}>Content</${componentName}>);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("className을 적용한다", () => {
    render(<${componentName} className="custom-class">Content</${componentName}>);

    expect(screen.getByText("Content")).toHaveClass("custom-class");
  });

  it("invalid 상태를 data attribute로 노출한다", () => {
    render(<${componentName} invalid>Content</${componentName}>);

    expect(screen.getByText("Content")).toHaveAttribute("data-invalid", "true");
  });
});
`;
}

function createUiComponentTemplate(params: Required<ComponentTemplateParams>): string {
  const { componentName, category, target, primitiveName } = params;

  const variantName = `${toCamelCase(componentName)}Variants`;
  const primitiveComponentName = `${componentName}Primitive`;
  const primitiveComponentExportName = toPascalCase(primitiveName);
  const baseClass =
    target === "admin"
      ? `"border-border bg-background text-foreground",
    "rounded-md border shadow-sm",
    "transition-colors",
    "data-[invalid=true]:border-destructive",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"`
      : `"border-border bg-background text-foreground",
    "rounded-lg border",
    "transition-colors",
    "data-[invalid=true]:border-destructive",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"`;

  return `"use client";

import { cva, type VariantProps } from "class-variance-authority";

import {
  ${primitiveComponentExportName} as ${primitiveComponentName},
  type ${primitiveComponentExportName}Props as ${componentName}PrimitiveProps,
} from "../../../primitives/${category}/${primitiveName}";
import { cn } from "../../../utils";

const ${variantName} = cva(
  [
    ${baseClass},
  ],
  {
    variants: {
      size: {
        sm: "min-h-8 px-3 py-1.5 text-sm",
        md: "min-h-10 px-3 py-2 text-sm",
        lg: "min-h-12 px-4 py-3 text-base",
      },
    },

    defaultVariants: {
      size: "md",
    },
  },
);

export interface ${componentName}Props
  extends Omit<${componentName}PrimitiveProps, "className">,
    VariantProps<typeof ${variantName}> {
  className?: string;
}

export default function ${componentName}({
  className,
  size,
  ...props
}: ${componentName}Props) {
  return (
    <${primitiveComponentName}
      className={cn(${variantName}({ size }), className)}
      {...props}
    />
  );
}
`;
}

function createUiTestTemplate(params: Required<ComponentTemplateParams>): string {
  const { componentName, kebabName, target } = params;
  const describeName = target === "admin" ? `Admin ${componentName}` : `Web ${componentName}`;

  return `import { render, screen } from "@testing-library/react";

import ${componentName} from "./${kebabName}";

describe("${describeName}", () => {
  it("children을 렌더링한다", () => {
    render(<${componentName}>Content</${componentName}>);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(<${componentName} className="custom-class">Content</${componentName}>);

    expect(screen.getByText("Content")).toHaveClass("custom-class");
  });

  it("size variant를 적용한다", () => {
    render(<${componentName} size="lg">Content</${componentName}>);

    expect(screen.getByText("Content")).toHaveClass("min-h-12");
  });
});
`;
}

function createUiStoryTemplate(params: Required<ComponentTemplateParams>): string {
  const { componentName, kebabName, category, target } = params;
  const storyTarget = target === "admin" ? "Admin" : "Web";
  const storyCategory = toPascalCase(category);

  return `import type { Meta, StoryObj } from "@storybook/react-vite";

import ${componentName} from "./${kebabName}";

const meta = {
  title: "${storyTarget}/${storyCategory}/${componentName}",
  component: ${componentName},
  args: {
    children: "${componentName}",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof ${componentName}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};
`;
}

async function generatePrimitiveComponent(params: {
  designSystemSrcPath: string;
  category: string;
  kebabName: string;
  componentName: string;
  force: boolean;
}): Promise<void> {
  const { designSystemSrcPath, category, kebabName, componentName, force } = params;

  const componentDir = path.join(designSystemSrcPath, "primitives", category, kebabName);

  await writeGeneratedFile({
    filePath: path.join(componentDir, `${kebabName}.tsx`),
    content: createPrimitiveComponentTemplate({
      category,
      componentName,
      kebabName,
    }),
    force,
  });

  await writeGeneratedFile({
    filePath: path.join(componentDir, `${kebabName}.test.tsx`),
    content: createPrimitiveTestTemplate({
      category,
      componentName,
      kebabName,
    }),
    force,
  });

  await writeGeneratedFile({
    filePath: path.join(componentDir, "index.ts"),
    content: createComponentIndexTemplate({
      componentName,
      kebabName,
    }),
    force,
  });

  await ensureExportLine(
    path.join(designSystemSrcPath, "primitives", category, "index.ts"),
    `export * from "./${kebabName}";`,
  );

  await ensureExportLine(
    path.join(designSystemSrcPath, "primitives", "index.ts"),
    `export * from "./${category}";`,
  );
}

async function generateUiComponent(params: {
  designSystemSrcPath: string;
  target: "web" | "admin";
  category: string;
  kebabName: string;
  componentName: string;
  primitiveName: string;
  force: boolean;
}): Promise<void> {
  const { designSystemSrcPath, target, category, kebabName, componentName, primitiveName, force } =
    params;

  const primitiveDir = path.join(designSystemSrcPath, "primitives", category, primitiveName);

  const primitiveExists = await exists(primitiveDir);

  if (!primitiveExists) {
    throw new Error(
      [
        `[component] primitive does not exist: ${primitiveDir}`,
        "Create primitive first or check --primitive option.",
      ].join("\n"),
    );
  }

  const componentDir = path.join(designSystemSrcPath, target, category, kebabName);

  await writeGeneratedFile({
    filePath: path.join(componentDir, `${kebabName}.tsx`),
    content: createUiComponentTemplate({
      category,
      componentName,
      kebabName,
      primitiveName,
      target,
    }),
    force,
  });

  await writeGeneratedFile({
    filePath: path.join(componentDir, `${kebabName}.test.tsx`),
    content: createUiTestTemplate({
      category,
      componentName,
      kebabName,
      primitiveName,
      target,
    }),
    force,
  });

  await writeGeneratedFile({
    filePath: path.join(componentDir, `${kebabName}.stories.tsx`),
    content: createUiStoryTemplate({
      category,
      componentName,
      kebabName,
      primitiveName,
      target,
    }),
    force,
  });

  await writeGeneratedFile({
    filePath: path.join(componentDir, "index.ts"),
    content: createComponentIndexTemplate({
      componentName,
      kebabName,
    }),
    force,
  });

  await ensureExportLine(
    path.join(designSystemSrcPath, target, category, "index.ts"),
    `export * from "./${kebabName}";`,
  );

  await ensureExportLine(
    path.join(designSystemSrcPath, target, "index.ts"),
    `export * from "./${category}";`,
  );
}

export async function generateComponent(params: GenerateComponentParams): Promise<void> {
  const options = parseOptions(params);

  const designSystemSrcPath = path.join(
    process.cwd(),
    "..",
    "..",
    "packages",
    "design-system",
    "src",
  );

  const kebabName = options.name;
  const componentName = toPascalCase(options.name);
  const targets = resolveTargets(options.target);

  for (const target of targets) {
    if (target === "primitive") {
      await generatePrimitiveComponent({
        designSystemSrcPath,
        category: options.category,
        kebabName,
        componentName,
        force: options.force,
      });

      console.info(`[component] created primitive component: ${componentName}`);
      continue;
    }

    await generateUiComponent({
      designSystemSrcPath,
      target,
      category: options.category,
      kebabName,
      componentName,
      primitiveName: options.primitiveName,
      force: options.force,
    });

    console.info(`[component] created ${target} component: ${componentName}`);
  }
}
