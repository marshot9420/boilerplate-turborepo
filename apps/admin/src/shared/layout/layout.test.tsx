import { usePathname } from "next/navigation";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { URLS } from "@/constants";

import Layout from "./layout";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockedUsePathname = vi.mocked(usePathname);

describe("Layout", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue(URLS.CLIENT.HOME);
  });

  it("전역 레이아웃 영역을 조립해서 렌더링한다", () => {
    render(
      <Layout
        user={{
          email: "admin@example.com",
          nickname: "관리자",
        }}
        headerActions={<button type="button">로그아웃</button>}
      >
        <h1>본문</h1>
      </Layout>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "주요 메뉴" })).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "본문" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
    expect(screen.getByText("관리자")).toBeInTheDocument();
  });

  it("user와 headerActions 없이도 렌더링한다", () => {
    render(
      <Layout>
        <p>내용</p>
      </Layout>,
    );

    expect(screen.getByText("내용")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
