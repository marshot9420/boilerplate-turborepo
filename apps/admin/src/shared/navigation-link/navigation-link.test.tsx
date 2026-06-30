import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NavigationLink from "./navigation-link";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockedUsePathname = vi.mocked(usePathname);

describe("NavigationLink", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/");
  });

  it("label과 description을 렌더링한다", () => {
    render(
      <NavigationLink
        item={{
          href: "/contents",
          label: "콘텐츠",
          description: "콘텐츠 관리",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "콘텐츠" })).toHaveAttribute("href", "/contents");
    expect(screen.getByText("콘텐츠")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠 관리")).toBeInTheDocument();
  });

  it("현재 경로와 href가 같으면 현재 페이지로 표시한다", () => {
    mockedUsePathname.mockReturnValue("/contents");

    render(
      <NavigationLink
        item={{
          href: "/contents",
          label: "콘텐츠",
          description: "콘텐츠 관리",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "콘텐츠" })).toHaveAttribute("aria-current", "page");
  });

  it("하위 경로이면 현재 페이지로 표시한다", () => {
    mockedUsePathname.mockReturnValue("/contents/123");

    render(
      <NavigationLink
        item={{
          href: "/contents",
          label: "콘텐츠",
          description: "콘텐츠 관리",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "콘텐츠" })).toHaveAttribute("aria-current", "page");
  });

  it("루트 링크는 정확히 루트 경로일 때만 현재 페이지로 표시한다", () => {
    mockedUsePathname.mockReturnValue("/contents");

    render(
      <NavigationLink
        item={{
          href: "/",
          label: "대시보드",
          description: "관리자 홈",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "대시보드" })).not.toHaveAttribute("aria-current");
  });
});
