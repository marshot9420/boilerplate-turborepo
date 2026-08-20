import { join } from "node:path";

import { writeFileSafe } from "../utils/file";
import { addPackageExport } from "../utils/package-json";
import { toCamelCase, toConstantCase, toKebabCase, toPascalCase } from "../utils/string";

export interface GenerateDomainOptions {
  name: string;
  repository?: boolean;
}

export async function generateDomain({ name, repository = false }: GenerateDomainOptions) {
  const kebabName = toKebabCase(name);
  const pascalName = toPascalCase(kebabName);
  const camelName = toCamelCase(kebabName);
  const constantName = toConstantCase(kebabName);

  const domainDir = join(process.cwd(), "../../packages/domain/src", kebabName);

  const domainTestDir = join(domainDir, "test");

  const databaseDir = join(process.cwd(), "../../packages/database/src", kebabName);

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

import type {
  ${pascalName}DetailResponse,
  ${pascalName}Response,
} from "./${kebabName}.dto";

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
      content: repository
        ? `import type { AppError } from "@repo/core/errors";
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
`
        : `export {};
`,
    },
    {
      path: join(domainDir, "client.ts"),
      content: `export { ${constantName} } from "./${kebabName}.constant";
export type { ${pascalName}DetailResponse, ${pascalName}Response } from "./${kebabName}.dto";
export type {
  Create${pascalName}RequestInput,
  ${pascalName}IdParamInput,
  ${pascalName}ListQuery,
  ${pascalName}ListSortKey,
  Update${pascalName}RequestInput,
} from "./${kebabName}.schema";
export {
  Create${pascalName}Request,
  ${pascalName}IdParam,
  ${pascalName}ListSortKeys,
  Update${pascalName}Request,
} from "./${kebabName}.schema";
`,
    },
    {
      path: join(domainDir, "server.ts"),
      content: `import "server-only";

export type { ${pascalName}ErrorCode } from "./${kebabName}.error";
export { ${constantName}_ERROR_CODE } from "./${kebabName}.error";
export {
  to${pascalName}DetailResponse,
  to${pascalName}Response,
} from "./${kebabName}.mapper";
export type { ${pascalName}PermissionActor } from "./${kebabName}.permission";
export {
  canCreate${pascalName},
  canDelete${pascalName},
  canRead${pascalName},
  canUpdate${pascalName},
} from "./${kebabName}.permission";
${
  repository
    ? `export { get${pascalName}ByIdService } from "./${kebabName}.service";
`
    : ""
}`,
    },
  ];

  const domainTestFiles = [
    {
      path: join(domainTestDir, `${kebabName}.schema.test.ts`),
      content: `import { describe, expect, it } from "vitest";

import {
  Create${pascalName}Request,
  ${pascalName}IdParam,
  ${pascalName}ListSortKeys,
  Update${pascalName}Request,
} from "../${kebabName}.schema";

describe("${pascalName} schema", () => {
  it("올바른 id 파라미터를 검증한다", () => {
    const result = ${pascalName}IdParam.safeParse({
      id: "00000000-0000-4000-8000-000000000000",
    });

    expect(result.success).toBe(true);
  });

  it("올바르지 않은 id 파라미터를 거부한다", () => {
    const result = ${pascalName}IdParam.safeParse({
      id: "invalid-id",
    });

    expect(result.success).toBe(false);
  });

  it("생성 요청을 검증한다", () => {
    const result = Create${pascalName}Request.safeParse({});

    expect(result.success).toBe(true);
  });

  it("수정 요청을 검증한다", () => {
    const result = Update${pascalName}Request.safeParse({});

    expect(result.success).toBe(true);
  });

  it("목록 정렬 키를 가진다", () => {
    expect([...${pascalName}ListSortKeys]).toEqual([
      "CREATED_AT",
      "UPDATED_AT",
    ]);
  });
});
`,
    },
    {
      path: join(domainTestDir, `${kebabName}.mapper.test.ts`),
      content: `import type { ${pascalName} } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  to${pascalName}DetailResponse,
  to${pascalName}Response,
} from "../${kebabName}.mapper";

function build${pascalName}Fixture(
  overrides: Partial<${pascalName}> = {},
): ${pascalName} {
  const now = new Date("2026-01-01T00:00:00.000Z");

  return {
    id: "00000000-0000-4000-8000-000000000000",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as ${pascalName};
}

describe("${pascalName} mapper", () => {
  it("${pascalName}Response로 변환한다", () => {
    const ${camelName} = build${pascalName}Fixture();

    const result = to${pascalName}Response(${camelName});

    expect(result).toEqual({
      id: ${camelName}.id,
      createdAt: ${camelName}.createdAt.toISOString(),
      updatedAt: ${camelName}.updatedAt.toISOString(),
    });
  });

  it("${pascalName}DetailResponse로 변환한다", () => {
    const ${camelName} = build${pascalName}Fixture();

    const result = to${pascalName}DetailResponse(${camelName});

    expect(result).toEqual({
      id: ${camelName}.id,
      createdAt: ${camelName}.createdAt.toISOString(),
      updatedAt: ${camelName}.updatedAt.toISOString(),
    });
  });
});
`,
    },
    {
      path: join(domainTestDir, `${kebabName}.permission.test.ts`),
      content: `import { describe, expect, it } from "vitest";

import {
  canCreate${pascalName},
  canDelete${pascalName},
  canRead${pascalName},
  canUpdate${pascalName},
  type ${pascalName}PermissionActor,
} from "../${kebabName}.permission";

describe("${pascalName} permission", () => {
  const actor: ${pascalName}PermissionActor = {
    id: "actor-id",
  };

  it("읽기 권한을 확인한다", () => {
    expect(canRead${pascalName}(actor)).toBe(true);
  });

  it("생성 권한을 확인한다", () => {
    expect(canCreate${pascalName}(actor)).toBe(true);
  });

  it("수정 권한을 확인한다", () => {
    expect(canUpdate${pascalName}(actor)).toBe(true);
  });

  it("삭제 권한을 확인한다", () => {
    expect(canDelete${pascalName}(actor)).toBe(true);
  });
});
`,
    },
  ];

  const serviceTestFiles = repository
    ? [
        {
          path: join(domainTestDir, `${kebabName}.service.test.ts`),
          content: `import type { ${pascalName} } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { logger } from "@repo/core/logger";
import { find${pascalName}ByIdRepository } from "@repo/database/${kebabName}";

import { ${constantName}_ERROR_CODE } from "../${kebabName}.error";
import { get${pascalName}ByIdService } from "../${kebabName}.service";

vi.mock("@repo/database/${kebabName}", () => ({
  find${pascalName}ByIdRepository: vi.fn(),
}));

vi.mock("@repo/core/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

const mockFind${pascalName}ByIdRepository = vi.mocked(
  find${pascalName}ByIdRepository,
);

const mockLoggerError = vi.mocked(logger.error);

function build${pascalName}Fixture(
  overrides: Partial<${pascalName}> = {},
): ${pascalName} {
  const now = new Date("2026-01-01T00:00:00.000Z");

  return {
    id: "00000000-0000-4000-8000-000000000000",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as ${pascalName};
}

describe("${pascalName} service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("${pascalName}을 조회하고 DetailResponse를 반환한다", async () => {
    const ${camelName} = build${pascalName}Fixture();

    mockFind${pascalName}ByIdRepository.mockResolvedValueOnce(${camelName});

    const result = await get${pascalName}ByIdService(${camelName}.id);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected success result");
    }

    expect(result.data).toEqual({
      id: ${camelName}.id,
      createdAt: ${camelName}.createdAt.toISOString(),
      updatedAt: ${camelName}.updatedAt.toISOString(),
    });
  });

  it("${pascalName}이 없으면 NOT_FOUND 실패 Result를 반환한다", async () => {
    mockFind${pascalName}ByIdRepository.mockResolvedValueOnce(null);

    const result = await get${pascalName}ByIdService(
      "00000000-0000-4000-8000-000000000000",
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("Expected failure result");
    }

    expect(result.error.code).toBe(${constantName}_ERROR_CODE.NOT_FOUND);
  });

  it("repository 에러가 발생하면 실패 Result를 반환하고 로그를 남긴다", async () => {
    const ${camelName}Id = "00000000-0000-4000-8000-000000000000";

    const repositoryError = {
      code: "DATABASE_UNKNOWN_ERROR",
      message: "데이터 처리 중 오류가 발생했습니다.",
    };

    mockFind${pascalName}ByIdRepository.mockRejectedValueOnce(repositoryError);

    const result = await get${pascalName}ByIdService(${camelName}Id);

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("Expected failure result");
    }

    expect(result.error).toBe(repositoryError);

    expect(mockLoggerError).toHaveBeenCalledWith(
      "${camelName}.get_by_id.failed",
      {
        ${camelName}Id,
        error: repositoryError,
      },
    );
  });
});
`,
        },
      ]
    : [];

  const databaseFiles = repository
    ? [
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
          content: `export {
  create${pascalName}Repository,
  delete${pascalName}Repository,
  find${pascalName}ByIdRepository,
  update${pascalName}Repository,
} from "./${kebabName}.repository";
`,
        },
      ]
    : [];

  const databaseTestFiles = repository
    ? [
        {
          path: join(databaseDir, `${kebabName}.repository.test.ts`),
          content: `import type { Prisma, ${pascalName} } from "@prisma/client";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { prisma } from "../client";
import { mapPrismaError } from "../errors";

import {
  create${pascalName}Repository,
  delete${pascalName}Repository,
  find${pascalName}ByIdRepository,
  update${pascalName}Repository,
} from "./${kebabName}.repository";

vi.mock("../client", () => ({
  prisma: {
    ${camelName}: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("../errors", () => ({
  mapPrismaError: vi.fn((error: unknown) => ({
    code: "DATABASE_UNKNOWN_ERROR",
    message: "데이터 처리 중 오류가 발생했습니다.",
    cause: error,
  })),
}));

const mockCreate = prisma.${camelName}.create as unknown as Mock;
const mockFindUnique = prisma.${camelName}.findUnique as unknown as Mock;
const mockUpdate = prisma.${camelName}.update as unknown as Mock;
const mockDelete = prisma.${camelName}.delete as unknown as Mock;
const mockMapPrismaError = vi.mocked(mapPrismaError);

function build${pascalName}Fixture(
  overrides: Partial<${pascalName}> = {},
): ${pascalName} {
  const now = new Date("2026-01-01T00:00:00.000Z");

  return {
    id: "00000000-0000-4000-8000-000000000000",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as ${pascalName};
}

describe("${pascalName} repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("${pascalName}을 생성한다", async () => {
    const data = {} as Prisma.${pascalName}CreateInput;
    const ${camelName} = build${pascalName}Fixture();

    mockCreate.mockResolvedValueOnce(${camelName});

    const result = await create${pascalName}Repository(data);

    expect(result).toEqual(${camelName});

    expect(mockCreate).toHaveBeenCalledWith({
      data,
    });
  });

  it("${pascalName}을 id로 조회한다", async () => {
    const ${camelName} = build${pascalName}Fixture();

    mockFindUnique.mockResolvedValueOnce(${camelName});

    const result = await find${pascalName}ByIdRepository(${camelName}.id);

    expect(result).toEqual(${camelName});

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        id: ${camelName}.id,
      },
    });
  });

  it("${pascalName}을 수정한다", async () => {
    const ${camelName} = build${pascalName}Fixture();
    const data = {} as Prisma.${pascalName}UpdateInput;

    mockUpdate.mockResolvedValueOnce(${camelName});

    const result = await update${pascalName}Repository(${camelName}.id, data);

    expect(result).toEqual(${camelName});

    expect(mockUpdate).toHaveBeenCalledWith({
      where: {
        id: ${camelName}.id,
      },
      data,
    });
  });

  it("${pascalName}을 삭제한다", async () => {
    const ${camelName} = build${pascalName}Fixture();

    mockDelete.mockResolvedValueOnce(${camelName});

    const result = await delete${pascalName}Repository(${camelName}.id);

    expect(result).toEqual(${camelName});

    expect(mockDelete).toHaveBeenCalledWith({
      where: {
        id: ${camelName}.id,
      },
    });
  });

  it("Prisma 에러를 AppError로 변환해 다시 throw한다", async () => {
    const originalError = new Error("database error");

    const mappedError = {
      code: "DATABASE_UNKNOWN_ERROR",
      message: "데이터 처리 중 오류가 발생했습니다.",
      cause: originalError,
    };

    mockFindUnique.mockRejectedValueOnce(originalError);
    mockMapPrismaError.mockReturnValueOnce(mappedError);

    await expect(
      find${pascalName}ByIdRepository(
        "00000000-0000-4000-8000-000000000000",
      ),
    ).rejects.toEqual(mappedError);

    expect(mockMapPrismaError).toHaveBeenCalledWith(originalError);
  });
});
`,
        },
        {
          path: join(databaseDir, `${kebabName}.repository.integration.test.ts`),
          content: `import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import { find${pascalName}ByIdRepository } from "./${kebabName}.repository";

describe("${pascalName} repository integration", () => {
  it("존재하지 않는 id를 조회하면 null을 반환한다", async () => {
    const result = await find${pascalName}ByIdRepository(randomUUID());

    expect(result).toBeNull();
  });
});
`,
        },
      ]
    : [];

  console.info("[generators] domain generator");

  console.info({
    name: kebabName,
    pascalName,
    camelName,
    constantName,
    repository,
  });

  const files = [
    ...domainFiles,
    ...domainTestFiles,
    ...serviceTestFiles,
    ...databaseFiles,
    ...databaseTestFiles,
  ];

  for (const file of files) {
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

  if (repository) {
    await addPackageExport({
      packageJsonPath: join(process.cwd(), "../../packages/database/package.json"),
      exportPath: `./${kebabName}`,
      targetPath: `./src/${kebabName}/index.ts`,
    });
  }
}
