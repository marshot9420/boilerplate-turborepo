import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { URLS } from "@/constants";

import Sidebar from "./sidebar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockedUsePathname = vi.mocked(usePathname);

const navigationItems = [
  {
    href: URLS.CLIENT.HOME,
    label: "대시보드",
    description: "관리자 홈",
  },
  {
    href: URLS.CLIENT.CONTENTS,
    label: "콘텐츠",
    description: "콘텐츠 관리",
  },
] as const;

describe("Sidebar", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue(URLS.CLIENT.HOME);
  });

  it("브랜드와 내비게이션을 렌더링한다", () => {
    render(<Sidebar navigationItems={navigationItems} />);

    expect(screen.getByText("Boilerplate")).toBeInTheDocument();
    expect(screen.getByText("Management Console")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "주요 메뉴" })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "대시보드" })).toHaveAttribute(
      "href",
      URLS.CLIENT.HOME,
    );
    expect(screen.getByText("관리자 홈")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "콘텐츠" })).toHaveAttribute(
      "href",
      URLS.CLIENT.CONTENTS,
    );
    expect(screen.getByText("콘텐츠 관리")).toBeInTheDocument();
  });

  it("user가 있으면 사용자 정보를 렌더링한다", () => {
    render(
      <Sidebar
        navigationItems={navigationItems}
        user={{
          email: "admin@example.com",
          nickname: "관리자",
        }}
      />,
    );

    expect(screen.getByText("관리자")).toBeInTheDocument();
    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
  });

  it("nickname이 없으면 email을 표시 이름으로 사용한다", () => {
    render(
      <Sidebar
        navigationItems={navigationItems}
        user={{
          email: "admin@example.com",
          nickname: null,
        }}
      />,
    );

    expect(screen.getAllByText("admin@example.com")).toHaveLength(2);
  });

  it("user가 없으면 사용자 정보를 렌더링하지 않는다", () => {
    render(<Sidebar navigationItems={navigationItems} />);

    expect(screen.queryByText("admin@example.com")).not.toBeInTheDocument();
  });
});
