import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { AppError } from "@repo/core/errors";
import type { Result } from "@repo/core/result";
import type { UserDetailResponse } from "@repo/domain/user/client";

import UpdateMyProfileView from "./update-my-profile-view";

const actionMock = vi.hoisted(() => ({
  updateMyProfileAction: vi.fn(),
}));

vi.mock("@/actions/user", () => actionMock);

vi.mock("@/constants", () => ({
  URLS: {
    CLIENT: {
      MY_PAGE: "/me",
    },
  },
}));

vi.mock("@/features/user", () => ({
  UpdateMyProfileForm: ({ user, action }: { user: UserDetailResponse; action: unknown }) => (
    <section aria-label="내 정보 수정 폼">
      <p>{user.nickname}</p>
      <p>{user.email}</p>
      <p>{typeof action}</p>
    </section>
  ),
}));

const user = {
  id: "user-1",
  email: "user@example.com",
  name: "USER",
  avatarUrl: "https://example.com/avatar.png",
  nickname: "user123",
  role: "USER",
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  lastLoginAt: "2026-01-03T00:00:00.000Z",
  deletedAt: null,
} satisfies UserDetailResponse;

describe("UpdateMyProfileView", () => {
  it("내 정보 조회에 성공하면 수정 화면과 수정 폼을 렌더링한다", () => {
    const result = {
      ok: true,
      data: user,
    } satisfies Result<UserDetailResponse, AppError>;

    render(<UpdateMyProfileView result={result} />);

    expect(screen.getByText("마이페이지")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "내 정보 수정" })).toBeInTheDocument();

    expect(
      screen.getByText("현재 로그인된 계정의 기본 프로필 정보를 수정할 수 있습니다."),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "내 정보로 돌아가기" })).toHaveAttribute("href", "/me");

    expect(screen.getByRole("region", { name: "내 정보 수정 폼" })).toBeInTheDocument();
    expect(screen.getByText(user.nickname)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
  });

  it("내 정보 조회에 실패하면 에러 알림을 렌더링한다", () => {
    const error = {
      code: "USER_NOT_FOUND",
      message: "사용자를 찾을 수 없습니다.",
    } satisfies AppError;

    const result = {
      ok: false,
      error,
    } satisfies Result<UserDetailResponse, AppError>;

    render(<UpdateMyProfileView result={result} />);

    expect(screen.getByText("내 정보를 불러올 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();

    expect(screen.queryByRole("heading", { name: "내 정보 수정" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "내 정보 수정 폼" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "내 정보로 돌아가기" })).not.toBeInTheDocument();
  });
});
