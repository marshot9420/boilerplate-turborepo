import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { UserListItemResponse } from "@repo/domain/user/client";

import UserTable from "./user-table";

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

describe("UserTable", () => {
  it("사용자 목록을 테이블로 렌더링한다", () => {
    render(<UserTable users={[createMockUser()]} getUserHref={(userId) => `/users/${userId}`} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("gildong")).toBeInTheDocument();
    expect(screen.getByText("일반 사용자")).toBeInTheDocument();
    expect(screen.getByText("활성")).toBeInTheDocument();
    expect(screen.getByText("없음")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "상세" })).toHaveAttribute("href", "/users/user-id");
  });

  it("상세 링크 생성 함수가 없으면 관리 컬럼을 렌더링하지 않는다", () => {
    render(<UserTable users={[createMockUser()]} />);

    expect(screen.queryByRole("columnheader", { name: "관리" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "상세" })).not.toBeInTheDocument();
  });

  it("이름이 없으면 닉네임을 표시명으로 사용한다", () => {
    render(<UserTable users={[createMockUser({ name: null, nickname: "nickname-only" })]} />);

    const row = screen.getByRole("row", {
      name: /nickname-only user@example.com nickname-only 일반 사용자 활성/i,
    });

    expect(within(row).getAllByText("nickname-only")).toHaveLength(2);
    expect(within(row).getByText("user@example.com")).toBeInTheDocument();
  });
});
