import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Header from "./header";

const getCurrentAuthSessionMock = vi.hoisted(() => vi.fn());

vi.mock("@repo/auth/server", () => ({
  getCurrentAuthSession: getCurrentAuthSessionMock,
}));

vi.mock("@/features/auth", () => ({
  LogoutButton: () => <button type="button">로그아웃</button>,
}));

describe("Header", () => {
  beforeEach(() => {
    getCurrentAuthSessionMock.mockReset();
  });

  it("세션이 없으면 비로그인 헤더를 렌더링한다", async () => {
    getCurrentAuthSessionMock.mockResolvedValue(null);

    render(await Header());

    expect(screen.getByRole("link", { name: "로그인" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "로그아웃" })).not.toBeInTheDocument();
  });

  it("세션이 있으면 로그인 헤더를 렌더링한다", async () => {
    getCurrentAuthSessionMock.mockResolvedValue({
      user: {
        id: "user-id",
        email: "user@example.com",
      },
    });

    render(await Header());

    expect(screen.getByRole("link", { name: "마이페이지" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
  });

  it("세션 조회 중 에러가 발생하면 비로그인 헤더를 렌더링한다", async () => {
    getCurrentAuthSessionMock.mockRejectedValue(new Error("session failed"));

    render(await Header());

    expect(screen.getByRole("link", { name: "로그인" })).toBeInTheDocument();
  });
});
