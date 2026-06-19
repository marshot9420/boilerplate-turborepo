import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { URLS } from "@/constants";

import HeaderView from "./header-view";

vi.mock("@/features/auth", () => ({
  LogoutButton: () => <button type="button">로그아웃</button>,
}));

describe("HeaderView", () => {
  it("헤더 랜드마크를 렌더링한다", () => {
    render(<HeaderView />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("브랜드 링크를 홈으로 연결한다", () => {
    render(<HeaderView />);

    expect(screen.getByRole("link", { name: "Web" })).toHaveAttribute("href", URLS.CLIENT.HOME);
  });

  it("주요 메뉴를 렌더링한다", () => {
    render(<HeaderView />);

    const navigation = screen.getByRole("navigation", {
      name: "주요 메뉴",
    });

    expect(within(navigation).getByRole("link", { name: "홈" })).toHaveAttribute(
      "href",
      URLS.CLIENT.HOME,
    );

    expect(within(navigation).getByRole("link", { name: "콘텐츠" })).toHaveAttribute(
      "href",
      URLS.CLIENT.CONTENTS,
    );
  });

  it("비로그인 상태에서는 로그인 링크만 렌더링한다", () => {
    render(<HeaderView isAuthenticated={false} />);

    expect(screen.getByRole("link", { name: "로그인" })).toHaveAttribute("href", URLS.CLIENT.LOGIN);

    expect(screen.queryByRole("link", { name: "마이페이지" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "로그아웃" })).not.toBeInTheDocument();
  });

  it("로그인 상태에서는 마이페이지 링크와 로그아웃 버튼을 렌더링한다", () => {
    render(<HeaderView isAuthenticated />);

    expect(screen.getByRole("link", { name: "마이페이지" })).toHaveAttribute(
      "href",
      URLS.CLIENT.MY_PAGE,
    );

    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "로그인" })).not.toBeInTheDocument();
  });
});
