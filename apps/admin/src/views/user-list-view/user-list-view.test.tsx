import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { PaginationMeta } from "@repo/core/pagination";
import type { UserListItemResponse, UserListResponse } from "@repo/domain/user/client";

import UserListView from "./user-list-view";

function createMockUser(overrides: Partial<UserListItemResponse> = {}): UserListItemResponse {
  return {
    id: "user-id",
    email: "user@example.com",
    name: "홍길동",
    avatarUrl: null,
    nickname: "gildong",
    role: "USER",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    lastLoginAt: null,
    ...overrides,
  };
}

function createMeta(overrides: Partial<PaginationMeta> = {}): PaginationMeta {
  return {
    page: 1,
    limit: 20,
    totalCount: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    ...overrides,
  };
}

function createResult(overrides: Partial<UserListResponse> = {}): UserListResponse {
  return {
    items: [createMockUser()],
    meta: createMeta(),
    ...overrides,
  };
}

describe("UserListView", () => {
  it("사용자 목록 조회 성공 화면을 렌더링한다", () => {
    render(
      <UserListView
        action="/users"
        query={{}}
        result={createResult({
          meta: createMeta({
            page: 1,
            totalCount: 2,
            totalPages: 2,
            hasNextPage: true,
          }),
        })}
        getUserHref={(userId) => `/users/${userId}`}
      />,
    );

    expect(screen.getByRole("heading", { name: "사용자 관리" })).toBeInTheDocument();
    expect(
      screen.getByText("가입한 사용자를 조회하고 상태와 권한을 확인합니다."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("검색어")).toBeInTheDocument();
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("1 / 2 페이지")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "상세" })).toHaveAttribute("href", "/users/user-id");

    expect(
      screen.getByRole("navigation", {
        name: "사용자 목록 페이지 이동",
      }),
    ).toBeInTheDocument();
  });

  it("사용자 목록 조회 실패 메시지를 렌더링한다", () => {
    render(<UserListView action="/users" query={{}} errorMessage="조회 실패" />);

    expect(screen.getByRole("heading", { name: "사용자 관리" })).toBeInTheDocument();
    expect(screen.getByText("사용자 목록을 조회하지 못했습니다.")).toBeInTheDocument();
    expect(screen.getByText("조회 실패")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("사용자 목록이 비어 있으면 빈 상태를 렌더링한다", () => {
    render(
      <UserListView
        action="/users"
        query={{}}
        result={createResult({
          items: [],
          meta: createMeta({
            totalCount: 0,
            totalPages: 1,
          }),
        })}
      />,
    );

    expect(screen.getByText("조회된 사용자가 없습니다.")).toBeInTheDocument();
    expect(
      screen.getByText("검색어나 필터 조건을 변경해서 다시 조회해 보세요."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();

    expect(
      screen.queryByRole("navigation", {
        name: "사용자 목록 페이지 이동",
      }),
    ).not.toBeInTheDocument();
  });
});
