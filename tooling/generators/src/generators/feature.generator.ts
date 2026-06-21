import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { logger } from "../utils/logger";
import { toKebabCase, toPascalCase } from "../utils/string";

const featureApps = ["web", "admin"] as const;

type FeatureApp = (typeof featureApps)[number];

interface GenerateFeatureParams {
  name: string;
  args: string[];
}

interface FeatureGeneratorOptions {
  app: FeatureApp;
  name: string;
  force: boolean;
}

interface ParsedFlag {
  key: string;
  value: string | true;
}

function isFeatureApp(value: string): value is FeatureApp {
  return featureApps.includes(value as FeatureApp);
}

function parseFlag(value: string, nextValue: string | undefined): ParsedFlag {
  if (!value.startsWith("--")) {
    throw new Error(`[feature] invalid option format: ${value}`);
  }

  const normalized = value.slice(2);
  const [key, inlineValue] = normalized.split("=");

  if (!key) {
    throw new Error(`[feature] invalid option name: ${value}`);
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

function parseOptions(params: GenerateFeatureParams): FeatureGeneratorOptions {
  const values = [params.name, ...params.args].filter(Boolean);
  const flags = new Map<string, string | true>();
  const positionals: string[] = [];

  for (let index = 0; index < values.length; index += 1) {
    const current = values[index];

    if (!current) {
      continue;
    }

    if (!current.startsWith("--")) {
      positionals.push(current);
      continue;
    }

    const next = values[index + 1];
    const parsed = parseFlag(current, next);

    if (!["app", "force"].includes(parsed.key)) {
      throw new Error(`[feature] unsupported option: --${parsed.key}`);
    }

    flags.set(parsed.key, parsed.value);

    if (parsed.value !== true && parsed.value === next) {
      index += 1;
    }
  }

  const rawApp = flags.get("app");

  let app: FeatureApp | undefined;
  let rawName: string | undefined;

  if (typeof rawApp === "string") {
    if (!isFeatureApp(rawApp)) {
      throw new Error(`[feature] --app must be one of: ${featureApps.join(", ")}`);
    }

    app = rawApp;
    rawName = positionals[0];
  } else {
    const [first, second] = positionals;

    if (first && isFeatureApp(first)) {
      app = first;
      rawName = second;
    } else {
      rawName = first;
    }
  }

  if (!app) {
    throw new Error(`[feature] --app is required. Available values: ${featureApps.join(", ")}`);
  }

  if (!rawName) {
    throw new Error("[feature] feature name is required.");
  }

  const name = toKebabCase(rawName);

  if (!name) {
    throw new Error("[feature] feature name is invalid.");
  }

  return {
    app,
    name,
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

async function writeGeneratedFile(params: {
  filePath: string;
  content: string;
  force: boolean;
}): Promise<void> {
  const { filePath, content, force } = params;
  const fileExists = await exists(filePath);

  if (fileExists && !force) {
    throw new Error(
      [`[feature] file already exists: ${filePath}`, "Use --force to overwrite it."].join("\n"),
    );
  }

  await mkdir(path.dirname(filePath), {
    recursive: true,
  });

  await writeFile(filePath, content);

  logger.info("file.created", {
    path: filePath,
  });
}

function createFormStateTemplate(params: { componentName: string }): string {
  const { componentName } = params;

  return `import type { ActionResult } from "@repo/core/action";

export type ${componentName}State = ActionResult<unknown> | null;

export const initial${componentName}State: ${componentName}State = null;
`;
}

function createFormTemplate(params: {
  componentName: string;
  formStateName: string;
  stateFileName: string;
}): string {
  const { componentName, formStateName, stateFileName } = params;

  return `"use client";

import { type ReactNode, useActionState } from "react";

import {
  initial${formStateName},
  type ${formStateName},
} from "../model/${stateFileName}";

export interface ${componentName}Props {
  action: (
    prevState: ${formStateName},
    formData: FormData,
  ) => Promise<${formStateName}>;
  children?: ReactNode;
  initialState?: ${formStateName};
  submitLabel?: string;
}

export default function ${componentName}({
  action,
  children,
  initialState = initial${formStateName},
  submitLabel = "저장",
}: ${componentName}Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      aria-label="${componentName}"
      className="space-y-4"
    >
      {children ? <div className="space-y-4">{children}</div> : null}

      {state?.message ? (
        <p
          className="text-sm"
          role={state.ok ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "처리 중..." : submitLabel}
      </button>
    </form>
  );
}
`;
}

function createTestTemplate(params: { componentName: string; formFileName: string }): string {
  const { componentName, formFileName } = params;

  return `import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ${componentName} from "./ui/${formFileName}";

describe("${componentName}", () => {
  const action = vi.fn(async () => ({
    ok: true,
    data: null,
    message: "처리되었습니다.",
  }));

  it("폼과 제출 버튼을 렌더링한다", () => {
    render(
      <${componentName}
        action={action}
        submitLabel="변경"
      />,
    );

    expect(
      screen.getByRole("form", {
        name: "${componentName}",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "변경",
      }),
    ).toBeEnabled();
  });

  it("children을 렌더링한다", () => {
    render(
      <${componentName} action={action}>
        <label htmlFor="title">제목</label>
        <input id="title" name="title" />
      </${componentName}>,
    );

    expect(screen.getByLabelText("제목")).toBeInTheDocument();
  });

  it("실패 상태 메시지를 렌더링한다", () => {
    render(
      <${componentName}
        action={action}
        initialState={{
          ok: false,
          code: "FEATURE_ERROR",
          message: "처리에 실패했습니다.",
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("처리에 실패했습니다.");
  });

  it("성공 상태 메시지를 렌더링한다", () => {
    render(
      <${componentName}
        action={action}
        initialState={{
          ok: true,
          data: null,
          message: "처리되었습니다.",
        }}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("처리되었습니다.");
  });
});
`;
}

function createStoryTemplate(params: {
  app: FeatureApp;
  componentName: string;
  formFileName: string;
  formStateName: string;
}): string {
  const { app, componentName, formFileName, formStateName } = params;
  const appTitle = app === "admin" ? "Admin" : "Web";

  return `import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import type { ${formStateName} } from "./model/${formFileName}-state";
import ${componentName} from "./ui/${formFileName}";

async function action(): Promise<${formStateName}> {
  return {
    ok: true,
    data: null,
    message: "처리되었습니다.",
  };
}

const meta = {
  title: "${appTitle}/Features/${componentName}",
  component: ${componentName},
  args: {
    action,
    submitLabel: "저장",
  },
} satisfies Meta<typeof ${componentName}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <${componentName} {...args}>
      <label
        className="block text-sm font-medium"
        htmlFor="example"
      >
        예시 필드
      </label>
      <input
        id="example"
        name="example"
        className="h-10 w-full rounded-md border px-3 text-sm"
        placeholder="값을 입력하세요"
      />
    </${componentName}>
  ),
};

export const Success: Story = {
  args: {
    initialState: {
      ok: true,
      data: null,
      message: "처리되었습니다.",
    },
  },
};

export const Failure: Story = {
  args: {
    initialState: {
      ok: false,
      code: "FEATURE_ERROR",
      message: "처리에 실패했습니다.",
    },
  },
};
`;
}

function createIndexTemplate(params: { componentName: string; formFileName: string }): string {
  const { componentName, formFileName } = params;

  return `export { default as ${componentName} } from "./ui/${formFileName}";
export type { ${componentName}Props } from "./ui/${formFileName}";
export * from "./model/${formFileName}-state";
`;
}

export async function generateFeature(params: GenerateFeatureParams): Promise<void> {
  const options = parseOptions(params);

  const featureName = options.name;
  const pascalName = toPascalCase(featureName);
  const componentName = `${pascalName}Form`;
  const formFileName = `${featureName}-form`;
  const formStateName = `${componentName}State`;

  const appSrcPath = path.join(process.cwd(), "..", "..", "apps", options.app, "src");
  const featureDir = path.join(appSrcPath, "features", featureName);

  logger.info("feature.generator", {
    app: options.app,
    name: featureName,
    componentName,
  });

  await writeGeneratedFile({
    filePath: path.join(featureDir, "ui", `${formFileName}.tsx`),
    content: createFormTemplate({
      componentName,
      formStateName,
      stateFileName: `${formFileName}-state`,
    }),
    force: options.force,
  });

  await writeGeneratedFile({
    filePath: path.join(featureDir, "model", `${formFileName}-state.ts`),
    content: createFormStateTemplate({
      componentName,
    }),
    force: options.force,
  });

  await writeGeneratedFile({
    filePath: path.join(featureDir, `${formFileName}.test.tsx`),
    content: createTestTemplate({
      componentName,
      formFileName,
    }),
    force: options.force,
  });

  await writeGeneratedFile({
    filePath: path.join(featureDir, `${formFileName}.stories.tsx`),
    content: createStoryTemplate({
      app: options.app,
      componentName,
      formFileName,
      formStateName,
    }),
    force: options.force,
  });

  await writeGeneratedFile({
    filePath: path.join(featureDir, "index.ts"),
    content: createIndexTemplate({
      componentName,
      formFileName,
    }),
    force: options.force,
  });

  logger.info("feature.created", {
    app: options.app,
    name: featureName,
  });
}
