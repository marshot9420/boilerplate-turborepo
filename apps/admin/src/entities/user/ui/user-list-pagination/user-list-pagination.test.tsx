import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { PaginationMeta } from "@repo/core/pagination";
import type { UserListQueryInput } from "@repo/domain/user/client";

import UserListPagination from "./user-list-pagination";

function createMeta(overrides: Partial<PaginationMeta> = {}): PaginationMeta {
  return {
    page: 2,
    limit: 20,
    totalCount: 60,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: true,
    ...overrides,
  };
}

describe("UserListPagination", () => {
  it("Pagination primitive에 meta와 getHref를 전달해서 링크 기반 페이지네이션을 렌더링한다", () => {
    const query = {
      keyword: " mars ",
      role: "ADMIN",
      status: "ACTIVE",
      sortKey: "EMAIL",
      sortDirection: "asc",
      limit: 50,
    } satisfies UserListQueryInput;

    render(<UserListPagination action="/users" query={query} meta={createMeta()} />);

    expect(
      screen.getByRole("navigation", {
        name: "사용자 목록 페이지 이동",
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "이전 페이지로 이동" })).toHaveAttribute(
      "href",
      "/users?keyword=mars&role=ADMIN&status=ACTIVE&sortKey=EMAIL&sortDirection=asc&limit=50",
    );

    expect(screen.getByRole("link", { name: "2 페이지로 이동" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    expect(screen.getByRole("link", { name: "다음 페이지로 이동" })).toHaveAttribute(
      "href",
      "/users?keyword=mars&role=ADMIN&status=ACTIVE&sortKey=EMAIL&sortDirection=asc&limit=50&page=3",
    );
  });

  it("검색 조건이 없으면 page 파라미터만 포함한 링크를 렌더링한다", () => {
    render(<UserListPagination action="/users" query={{}} meta={createMeta()} />);

    expect(screen.getByRole("link", { name: "다음 페이지로 이동" })).toHaveAttribute(
      "href",
      "/users?page=3",
    );
  });

  it("전체 페이지가 1 이하이면 렌더링하지 않는다", () => {
    const { container } = render(
      <UserListPagination
        action="/users"
        query={{}}
        meta={createMeta({
          page: 1,
          totalCount: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        })}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
