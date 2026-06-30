import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type PackageJson = {
  name?: string;
  private?: boolean;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

type WorkspaceProjectKind = "app" | "package";

type WorkspaceProject = {
  name: string;
  kind: WorkspaceProjectKind;
  relativePath: string;
  absolutePath: string;
  packageJson: PackageJson;
};

type BoundaryViolation = {
  from: WorkspaceProject;
  toPackageName: string;
  dependencyType: "dependencies" | "peerDependencies" | "optionalDependencies";
  message: string;
};

const RUNTIME_DEPENDENCY_KEYS = [
  "dependencies",
  "peerDependencies",
  "optionalDependencies",
] as const;

const FORBIDDEN_RUNTIME_DEPENDENCIES: Record<string, string[]> = {
  "@repo/core": [
    "@repo/database",
    "@repo/domain",
    "@repo/auth",
    "@repo/storage",
    "@repo/mailer",
    "@repo/design-system",
    "@repo/env",
  ],

  "@repo/env": [
    "@repo/database",
    "@repo/domain",
    "@repo/auth",
    "@repo/storage",
    "@repo/mailer",
    "@repo/design-system",
  ],

  "@repo/database": [
    "@repo/domain",
    "@repo/auth",
    "@repo/storage",
    "@repo/mailer",
    "@repo/design-system",
  ],

  "@repo/domain": ["@repo/auth", "@repo/storage", "@repo/mailer", "@repo/design-system"],

  "@repo/auth": ["@repo/storage", "@repo/mailer", "@repo/design-system"],

  "@repo/storage": [
    "@repo/database",
    "@repo/domain",
    "@repo/auth",
    "@repo/mailer",
    "@repo/design-system",
    "@repo/env",
  ],

  "@repo/mailer": [
    "@repo/database",
    "@repo/domain",
    "@repo/auth",
    "@repo/storage",
    "@repo/design-system",
    "@repo/env",
  ],

  "@repo/design-system": [
    "@repo/database",
    "@repo/domain",
    "@repo/auth",
    "@repo/storage",
    "@repo/mailer",
    "@repo/env",
  ],
};

const PACKAGE_ALLOWED_RUNTIME_DEPENDENCIES: Record<string, string[]> = {
  "@repo/core": [],

  "@repo/env": [],

  "@repo/database": ["@repo/core", "@repo/env"],

  "@repo/domain": ["@repo/core", "@repo/database"],

  "@repo/auth": ["@repo/core", "@repo/database", "@repo/domain", "@repo/env"],

  "@repo/storage": ["@repo/core"],

  "@repo/mailer": ["@repo/core"],

  "@repo/design-system": ["@repo/core"],
};

const IGNORED_WORKSPACE_PACKAGE_NAMES = new Set([
  "@repo/eslint-config",
  "@repo/typescript-config",
  "@repo/vitest-config",
  "@repo/playwright-config",
  "@repo/storybook-config",
  "@repo/scripts",
  "@repo/generators",
]);

async function main() {
  const repoRoot = await findRepoRoot();
  const projects = await findWorkspaceProjects(repoRoot);

  const workspacePackageNames = new Set(projects.map((project) => project.name));
  const apps = projects.filter((project) => project.kind === "app");

  const violations = findBoundaryViolations({
    projects,
    workspacePackageNames,
    apps,
  });

  if (violations.length === 0) {
    console.log("✅ Architecture boundaries are valid.");
    return;
  }

  console.error("❌ Architecture boundary violations found.\n");

  for (const violation of violations) {
    console.error(
      [
        `- ${violation.from.name}`,
        `  path: ${violation.from.relativePath}`,
        `  dependency: ${violation.toPackageName}`,
        `  type: ${violation.dependencyType}`,
        `  reason: ${violation.message}`,
      ].join("\n"),
    );

    console.error("");
  }

  process.exitCode = 1;
}

async function findRepoRoot() {
  let currentDirectory = path.dirname(fileURLToPath(import.meta.url));

  while (true) {
    const workspaceFilePath = path.join(currentDirectory, "pnpm-workspace.yaml");
    const rootPackageJsonPath = path.join(currentDirectory, "package.json");

    if (existsSync(workspaceFilePath) && existsSync(rootPackageJsonPath)) {
      return currentDirectory;
    }

    const parentDirectory = path.dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      throw new Error("레포지토리 루트를 찾을 수 없습니다.");
    }

    currentDirectory = parentDirectory;
  }
}

async function findWorkspaceProjects(repoRoot: string) {
  const workspaceRoots = [
    {
      kind: "app" as const,
      absolutePath: path.join(repoRoot, "apps"),
    },
    {
      kind: "package" as const,
      absolutePath: path.join(repoRoot, "packages"),
    },
  ];

  const projects: WorkspaceProject[] = [];

  for (const workspaceRoot of workspaceRoots) {
    if (!existsSync(workspaceRoot.absolutePath)) {
      continue;
    }

    const entries = await readdir(workspaceRoot.absolutePath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const absolutePath = path.join(workspaceRoot.absolutePath, entry.name);
      const packageJsonPath = path.join(absolutePath, "package.json");

      if (!existsSync(packageJsonPath)) {
        continue;
      }

      const packageJson = await readPackageJson(packageJsonPath);

      if (!packageJson.name) {
        continue;
      }

      projects.push({
        name: packageJson.name,
        kind: workspaceRoot.kind,
        relativePath: path.relative(repoRoot, absolutePath),
        absolutePath,
        packageJson,
      });
    }
  }

  return projects;
}

async function readPackageJson(packageJsonPath: string) {
  const rawPackageJson = await readFile(packageJsonPath, "utf8");

  return JSON.parse(rawPackageJson) as PackageJson;
}

function findBoundaryViolations(params: {
  projects: WorkspaceProject[];
  workspacePackageNames: Set<string>;
  apps: WorkspaceProject[];
}) {
  const { projects, workspacePackageNames, apps } = params;
  const appPackageNames = new Set(apps.map((app) => app.name));
  const violations: BoundaryViolation[] = [];

  for (const project of projects) {
    for (const dependencyType of RUNTIME_DEPENDENCY_KEYS) {
      const dependencies = project.packageJson[dependencyType] ?? {};

      for (const dependencyName of Object.keys(dependencies)) {
        if (!workspacePackageNames.has(dependencyName)) {
          continue;
        }

        const violation = getBoundaryViolation({
          project,
          dependencyName,
          dependencyType,
          appPackageNames,
        });

        if (violation) {
          violations.push(violation);
        }
      }
    }
  }

  return violations;
}

function getBoundaryViolation(params: {
  project: WorkspaceProject;
  dependencyName: string;
  dependencyType: BoundaryViolation["dependencyType"];
  appPackageNames: Set<string>;
}): BoundaryViolation | null {
  const { project, dependencyName, dependencyType, appPackageNames } = params;

  if (project.kind === "package" && appPackageNames.has(dependencyName)) {
    return {
      from: project,
      toPackageName: dependencyName,
      dependencyType,
      message: "packages/* 는 apps/* 에 의존할 수 없습니다.",
    };
  }

  if (IGNORED_WORKSPACE_PACKAGE_NAMES.has(project.name)) {
    return null;
  }

  const forbiddenDependencies = FORBIDDEN_RUNTIME_DEPENDENCIES[project.name];

  if (forbiddenDependencies?.includes(dependencyName)) {
    return {
      from: project,
      toPackageName: dependencyName,
      dependencyType,
      message: `${project.name} 는 ${dependencyName} 에 의존할 수 없습니다.`,
    };
  }

  if (project.kind !== "package") {
    return null;
  }

  const allowedDependencies = PACKAGE_ALLOWED_RUNTIME_DEPENDENCIES[project.name];

  if (!allowedDependencies) {
    return null;
  }

  if (!allowedDependencies.includes(dependencyName)) {
    return {
      from: project,
      toPackageName: dependencyName,
      dependencyType,
      message: `${project.name} 의 런타임 workspace 의존성은 ${formatAllowedDependencies(
        allowedDependencies,
      )} 만 허용됩니다.`,
    };
  }

  return null;
}

function formatAllowedDependencies(allowedDependencies: string[]) {
  if (allowedDependencies.length === 0) {
    return "없음";
  }

  return allowedDependencies.join(", ");
}

main().catch((error: unknown) => {
  console.error("❌ Failed to check architecture boundaries.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});
