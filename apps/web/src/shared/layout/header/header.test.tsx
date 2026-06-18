import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { URLS } from "@/constants";

import Header from "./header";

vi.mock("@/features/auth", () => ({
  LogoutButton: () => <button type="button">로그아웃</button>,
}));

describe("Web Header", () => {
  it("헤더 랜드마크를 렌더링한다", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("브랜드 링크를 홈으로 연결한다", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Web" })).toHaveAttribute("href", URLS.CLIENT.HOME);
  });

  it("주요 메뉴를 렌더링한다", () => {
    render(<Header />);

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

  it("로그인 링크와 로그아웃 버튼을 렌더링한다", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "로그인" })).toHaveAttribute("href", URLS.CLIENT.LOGIN);

    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
  });
});
