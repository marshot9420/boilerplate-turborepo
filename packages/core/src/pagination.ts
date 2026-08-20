export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const MIN_PAGE = 1;
const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

export function createPagination(input: PaginationInput = {}): PaginationResult {
  const page = Math.max(input.page ?? DEFAULT_PAGE, MIN_PAGE);

  const limit = Math.min(Math.max(input.limit ?? DEFAULT_LIMIT, MIN_LIMIT), MAX_LIMIT);

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    take: limit,
  };
}

export function createPaginationMeta(params: {
  page: number;
  limit: number;
  totalCount: number;
}): PaginationMeta {
  const totalPages = params.totalCount > 0 ? Math.ceil(params.totalCount / params.limit) : 1;

  return {
    page: params.page,
    limit: params.limit,
    totalCount: params.totalCount,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPreviousPage: params.page > 1,
  };
}
