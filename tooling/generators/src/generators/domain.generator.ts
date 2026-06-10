import { join } from "node:path";

import { writeFileSafe } from "../utils/file";
import { addPackageExport } from "../utils/package-json";
import {
  toCamelCase,
  toConstantCase,
  toKebabCase,
  toPascalCase,
} from "../utils/string";

export interface GenerateDomainOptions {
  name: string;
}

export async function generateDomain(options: GenerateDomainOptions) {
  const kebabName = toKebabCase(options.name);
  const pascalName = toPascalCase(kebabName);
  const camelName = toCamelCase(kebabName);
  const constantName = toConstantCase(kebabName);

  const domainDir = join(process.cwd(), "../../packages/domain/src", kebabName);
  const databaseDir = join(
    process.cwd(),
    "../../packages/database/src",
    kebabName,
  );

  const domainFiles = [
    {
      path: join(domainDir, `${kebabName}.constant.ts`),
      content: `export const ${constantName} = {
  ID: {
    KR: "${pascalName} 식별자",
    INVALID_MESSAGE: "${pascalName} 식별자가 올바르지 않습니다.",
  },
} as const;
`,
    },
    {
      path: join(domainDir, `${kebabName}.dto.ts`),
      content: `export interface ${pascalName}Response {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ${pascalName}DetailResponse extends ${pascalName}Response {}
`,
    },
    {
      path: join(domainDir, `${kebabName}.error.ts`),
      content: `export const ${constantName}_ERROR_CODE = {
  NOT_FOUND: "${constantName}_NOT_FOUND",
  FORBIDDEN: "${constantName}_FORBIDDEN",
} as const;

export type ${pascalName}ErrorCode =
  (typeof ${constantName}_ERROR_CODE)[keyof typeof ${constantName}_ERROR_CODE];
`,
    },
    {
      path: join(domainDir, `${kebabName}.schema.ts`),
      content: `import { z } from "zod";

import type { ListQuery } from "@repo/core/types";

import { ${constantName} } from "./${kebabName}.constant";

export const ${pascalName}IdParam = z.object({
  id: z.uuid(${constantName}.ID.INVALID_MESSAGE),
});

export type ${pascalName}IdParamInput = z.infer<typeof ${pascalName}IdParam>;

export const ${pascalName}ListSortKeys = ["CREATED_AT", "UPDATED_AT"] as const;

export type ${pascalName}ListSortKey =
  (typeof ${pascalName}ListSortKeys)[number];

export interface ${pascalName}ListQuery extends ListQuery<${pascalName}ListSortKey> {
  keyword?: string;
}

export const Create${pascalName}Request = z.object({});

export type Create${pascalName}RequestInput = z.infer<
  typeof Create${pascalName}Request
>;

export const Update${pascalName}Request = Create${pascalName}Request.partial();

export type Update${pascalName}RequestInput = z.infer<
  typeof Update${pascalName}Request
>;
`,
    },
    {
      path: join(domainDir, `${kebabName}.mapper.ts`),
      content: `import type { ${pascalName} } from "@prisma/client";

import type { ${pascalName}DetailResponse, ${pascalName}Response } from "./${kebabName}.dto";

export function to${pascalName}Response(
  ${camelName}: ${pascalName},
): ${pascalName}Response {
  return {
    id: ${camelName}.id,
    createdAt: ${camelName}.createdAt.toISOString(),
    updatedAt: ${camelName}.updatedAt.toISOString(),
  };
}

export function to${pascalName}DetailResponse(
  ${camelName}: ${pascalName},
): ${pascalName}DetailResponse {
  return to${pascalName}Response(${camelName});
}
`,
    },
    {
      path: join(domainDir, `${kebabName}.permission.ts`),
      content: `export interface ${pascalName}PermissionActor {
  id: string;
}

export function canRead${pascalName}(_actor: ${pascalName}PermissionActor) {
  return true;
}

export function canCreate${pascalName}(_actor: ${pascalName}PermissionActor) {
  return true;
}

export function canUpdate${pascalName}(_actor: ${pascalName}PermissionActor) {
  return true;
}

export function canDelete${pascalName}(_actor: ${pascalName}PermissionActor) {
  return true;
}
`,
    },
    {
      path: join(domainDir, `${kebabName}.service.ts`),
      content: `import type { AppError } from "@repo/core/errors";
import { logger } from "@repo/core/logger";
import { failure, success, type Result } from "@repo/core/result";
import { find${pascalName}ByIdRepository } from "@repo/database/${kebabName}";

import type { ${pascalName}DetailResponse } from "./${kebabName}.dto";
import { ${constantName}_ERROR_CODE } from "./${kebabName}.error";
import { to${pascalName}DetailResponse } from "./${kebabName}.mapper";

export async function get${pascalName}ByIdService(
  ${camelName}Id: string,
): Promise<Result<${pascalName}DetailResponse, AppError>> {
  try {
    const ${camelName} = await find${pascalName}ByIdRepository(${camelName}Id);

    if (!${camelName}) {
      return failure({
        code: ${constantName}_ERROR_CODE.NOT_FOUND,
        message: "${pascalName}을 찾을 수 없습니다.",
      });
    }

    return success(to${pascalName}DetailResponse(${camelName}));
  } catch (error) {
    logger.error("${camelName}.get_by_id.failed", {
      ${camelName}Id,
      error,
    });

    return failure(error as AppError);
  }
}
`,
    },
    {
      path: join(domainDir, "client.ts"),
      content: `export * from "./${kebabName}.constant";
export * from "./${kebabName}.dto";
export * from "./${kebabName}.schema";
`,
    },
    {
      path: join(domainDir, "server.ts"),
      content: `import "server-only";

export * from "./${kebabName}.error";
export * from "./${kebabName}.mapper";
export * from "./${kebabName}.permission";
export * from "./${kebabName}.service";
`,
    },
  ];

  const databaseFiles = [
    {
      path: join(databaseDir, `${kebabName}.repository.ts`),
      content: `import type { Prisma, ${pascalName} } from "@prisma/client";

import { prisma } from "../client";
import { mapPrismaError } from "../errors";

export async function create${pascalName}Repository(
  data: Prisma.${pascalName}CreateInput,
): Promise<${pascalName}> {
  try {
    return await prisma.${camelName}.create({ data });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function find${pascalName}ByIdRepository(
  ${camelName}Id: string,
): Promise<${pascalName} | null> {
  try {
    return await prisma.${camelName}.findUnique({
      where: {
        id: ${camelName}Id,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function update${pascalName}Repository(
  ${camelName}Id: string,
  data: Prisma.${pascalName}UpdateInput,
): Promise<${pascalName}> {
  try {
    return await prisma.${camelName}.update({
      where: {
        id: ${camelName}Id,
      },
      data,
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function delete${pascalName}Repository(
  ${camelName}Id: string,
): Promise<${pascalName}> {
  try {
    return await prisma.${camelName}.delete({
      where: {
        id: ${camelName}Id,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}
`,
    },
    {
      path: join(databaseDir, "index.ts"),
      content: `export * from "./${kebabName}.repository";
`,
    },
  ];

  console.info("[generators] domain generator");
  console.info({
    name: kebabName,
    pascalName,
    camelName,
    constantName,
  });

  for (const file of [...domainFiles, ...databaseFiles]) {
    await writeFileSafe(file);
  }

  await addPackageExport({
    packageJsonPath: join(process.cwd(), "../../packages/domain/package.json"),
    exportPath: `./${kebabName}/client`,
    targetPath: `./src/${kebabName}/client.ts`,
  });

  await addPackageExport({
    packageJsonPath: join(process.cwd(), "../../packages/domain/package.json"),
    exportPath: `./${kebabName}/server`,
    targetPath: `./src/${kebabName}/server.ts`,
  });

  await addPackageExport({
    packageJsonPath: join(
      process.cwd(),
      "../../packages/database/package.json",
    ),
    exportPath: `./${kebabName}`,
    targetPath: `./src/${kebabName}/index.ts`,
  });
}
