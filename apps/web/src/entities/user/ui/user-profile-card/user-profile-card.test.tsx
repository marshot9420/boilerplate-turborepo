import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { UserDetailResponse } from "@repo/domain/user/client";

import UserProfileCard from "./user-profile-card";

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

describe("UserProfileCard", () => {
  it("사용자 프로필 헤더와 상세 정보를 표시한다", () => {
    render(<UserProfileCard user={user} />);

    expect(screen.getByRole("heading", { name: user.nickname })).toBeInTheDocument();
    expect(screen.getAllByText(user.email)).toHaveLength(2);

    expect(screen.getAllByText("사용자").length).toBeGreaterThan(0);
    expect(screen.getAllByText("활성").length).toBeGreaterThan(0);

    expect(screen.getByText("이름")).toBeInTheDocument();
    expect(screen.getByText(user.name)).toBeInTheDocument();

    expect(screen.getByText("최근 로그인")).toBeInTheDocument();
  });

  it("프로필 이미지 alt를 설정한다", () => {
    render(<UserProfileCard user={user} />);

    expect(screen.getByAltText(`${user.nickname} 프로필 이미지`)).toBeInTheDocument();
  });

  it("actions를 전달하면 우측 액션 영역을 표시한다", () => {
    render(<UserProfileCard user={user} actions={<button type="button">프로필 수정</button>} />);

    expect(screen.getByRole("button", { name: "프로필 수정" })).toBeInTheDocument();
  });

  it("className을 전달할 수 있다", () => {
    const { container } = render(<UserProfileCard user={user} className="custom-class" />);

    expect(container.firstElementChild).toHaveClass("custom-class");
  });

  it("관리자와 차단 상태 배지를 표시한다", () => {
    render(
      <UserProfileCard
        user={{
          ...user,
          role: "ADMIN",
          status: "BANNED",
        }}
      />,
    );

    expect(screen.getAllByText("관리자").length).toBeGreaterThan(0);
    expect(screen.getAllByText("차단").length).toBeGreaterThan(0);
  });
});
