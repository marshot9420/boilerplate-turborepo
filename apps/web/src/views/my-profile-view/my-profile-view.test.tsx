import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ActionResult } from "@repo/core/action";
import type { UserDetailResponse } from "@repo/domain/user/client";

import MyProfileView from "./my-profile-view";

const user = {
  id: "user-1",
  email: "mars@example.com",
  name: "MARS",
  avatarUrl: "https://example.com/avatar.png",
  nickname: "mars_user",
  role: "USER",
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  lastLoginAt: "2026-01-03T00:00:00.000Z",
  deletedAt: null,
} satisfies UserDetailResponse;

describe("MyProfileView", () => {
  it("내 정보 조회에 성공하면 프로필 화면을 표시한다", () => {
    const result = {
      ok: true,
      data: user,
    } satisfies ActionResult<UserDetailResponse>;

    render(<MyProfileView result={result} />);

    expect(screen.getByRole("heading", { name: "내 정보" })).toBeInTheDocument();
    expect(screen.getByText("마이페이지")).toBeInTheDocument();
    expect(
      screen.getByText("현재 로그인된 계정의 기본 정보를 확인할 수 있습니다."),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: user.nickname })).toBeInTheDocument();
    expect(screen.getAllByText(user.email)).toHaveLength(2);
  });

  it("내 정보 조회에 실패하면 에러 알림을 표시한다", () => {
    const result = {
      ok: false,
      code: "USER_NOT_FOUND",
      message: "사용자를 찾을 수 없습니다.",
    } satisfies ActionResult<UserDetailResponse>;

    render(<MyProfileView result={result} />);

    expect(screen.getByText("내 정보를 불러올 수 없습니다.")).toBeInTheDocument();
    expect(screen.getByText(result.message)).toBeInTheDocument();

    expect(screen.queryByRole("heading", { name: "내 정보" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: user.nickname })).not.toBeInTheDocument();
  });

  it("성공 결과지만 사용자 데이터가 없으면 빈 상태를 표시한다", () => {
    const result = {
      ok: true,
      data: null,
    } as unknown as ActionResult<UserDetailResponse>;

    render(<MyProfileView result={result} />);

    expect(screen.getByText("사용자 정보가 없습니다.")).toBeInTheDocument();
    expect(screen.getByText("현재 로그인된 사용자 정보를 찾을 수 없습니다.")).toBeInTheDocument();
  });
});
