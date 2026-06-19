import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { UserDetailResponse } from "@repo/domain/user/client";

import UserInfoList from "./user-info-list";
import { formatUserDate } from "../../lib";

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

describe("UserInfoList", () => {
  it("사용자 기본 정보를 표시한다", () => {
    render(<UserInfoList user={user} />);

    expect(screen.getByText("이메일")).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();

    expect(screen.getByText("이름")).toBeInTheDocument();
    expect(screen.getByText(user.name)).toBeInTheDocument();

    expect(screen.getByText("닉네임")).toBeInTheDocument();
    expect(screen.getByText(user.nickname)).toBeInTheDocument();

    expect(screen.getByText("권한")).toBeInTheDocument();
    expect(screen.getByText("사용자")).toBeInTheDocument();

    expect(screen.getByText("상태")).toBeInTheDocument();
    expect(screen.getByText("활성")).toBeInTheDocument();
  });

  it("날짜 정보를 한국어 날짜 형식으로 표시한다", () => {
    render(<UserInfoList user={user} />);

    expect(screen.getByText("가입일")).toBeInTheDocument();
    expect(screen.getByText(formatUserDate(user.createdAt))).toBeInTheDocument();

    expect(screen.getByText("수정일")).toBeInTheDocument();
    expect(screen.getByText(formatUserDate(user.updatedAt))).toBeInTheDocument();

    expect(screen.getByText("최근 로그인")).toBeInTheDocument();
    expect(screen.getByText(formatUserDate(user.lastLoginAt))).toBeInTheDocument();
  });

  it("nullable 값이 없으면 없음으로 표시한다", () => {
    render(
      <UserInfoList
        user={{
          ...user,
          name: null,
          lastLoginAt: null,
        }}
      />,
    );

    expect(screen.getAllByText("없음")).toHaveLength(2);
  });

  it("className을 전달할 수 있다", () => {
    const { container } = render(<UserInfoList user={user} className="custom-class" />);

    expect(container.firstElementChild).toHaveClass("custom-class");
  });
});
