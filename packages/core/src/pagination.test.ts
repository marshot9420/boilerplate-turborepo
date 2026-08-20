import { describe, expect, it } from "vitest";

import { buildPagination, buildPaginationMeta } from "./pagination";

describe("buildPagination", () => {
  it("기본 페이지네이션 값을 생성한다", () => {
    expect(buildPagination()).toEqual({
      page: 1,
      limit: 20,
      skip: 0,
      take: 20,
    });
  });

  it("page와 limit 범위를 보정한다", () => {
    expect(buildPagination({ page: -1, limit: 999 })).toEqual({
      page: 1,
      limit: 100,
      skip: 0,
      take: 100,
    });
  });

  it("skip 값을 계산한다", () => {
    expect(buildPagination({ page: 3, limit: 10 })).toEqual({
      page: 3,
      limit: 10,
      skip: 20,
      take: 10,
    });
  });
});

describe("buildPaginationMeta", () => {
  it("페이지 메타 정보를 생성한다", () => {
    expect(
      buildPaginationMeta({
        page: 2,
        limit: 10,
        totalCount: 25,
      }),
    ).toEqual({
      page: 2,
      limit: 10,
      totalCount: 25,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it("totalCount가 0이어도 totalPages는 1로 처리한다", () => {
    expect(
      buildPaginationMeta({
        page: 1,
        limit: 10,
        totalCount: 0,
      }).totalPages,
    ).toBe(1);
  });
});
