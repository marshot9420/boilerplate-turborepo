import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Sidebar, {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarLayout,
  SidebarNav,
  SidebarNavItem,
  SidebarNavLink,
  SidebarNavList,
  SidebarSeparator,
} from "./sidebar";

describe("Web Sidebar", () => {
  it("sidebar layout을 렌더링하고 width css variable을 설정한다", () => {
    render(<SidebarLayout data-testid="layout" sidebarWidth="sm" />);

    const layout = screen.getByTestId("layout");

    expect(layout).toHaveAttribute("data-sidebar-width", "sm");
    expect(layout.style.getPropertyValue("--ds-sidebar-width")).toBe("14rem");
  });

  it("sidebar 기본 상태를 렌더링한다", () => {
    render(<Sidebar data-testid="sidebar">사이드바</Sidebar>);

    const sidebar = screen.getByTestId("sidebar");

    expect(sidebar.tagName).toBe("ASIDE");
    expect(sidebar).toHaveAttribute("data-variant", "default");
    expect(sidebar).toHaveAttribute("data-sticky", "true");
    expect(sidebar).toHaveAttribute("data-hidden-on-mobile", "true");
    expect(sidebar).toHaveClass("hidden", "lg:flex");
  });

  it("SidebarInset은 main으로 렌더링한다", () => {
    render(<SidebarInset data-testid="inset">본문</SidebarInset>);

    const inset = screen.getByTestId("inset");

    expect(inset.tagName).toBe("MAIN");
    expect(inset).toHaveClass("bg-background", "min-w-0", "flex-1");
  });

  it("nav와 link를 렌더링한다", () => {
    render(
      <SidebarNav label="서비스 메뉴">
        <SidebarNavList>
          <SidebarNavItem>
            <SidebarNavLink href="/me" active>
              내 정보
            </SidebarNavLink>
          </SidebarNavItem>
        </SidebarNavList>
      </SidebarNav>,
    );

    const link = screen.getByRole("link", { name: "내 정보" });

    expect(screen.getByRole("navigation", { name: "서비스 메뉴" })).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/me");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("data-active", "true");
  });

  it("danger tone을 반영한다", () => {
    render(
      <SidebarNavLink href="/leave" tone="danger">
        탈퇴
      </SidebarNavLink>,
    );

    const link = screen.getByRole("link", { name: "탈퇴" });

    expect(link).toHaveAttribute("data-tone", "danger");
    expect(link).toHaveClass("text-destructive");
  });

  it("separator를 렌더링한다", () => {
    render(<SidebarSeparator data-testid="separator" />);

    expect(screen.getByTestId("separator")).toHaveAttribute("role", "separator");
  });

  it("전체 sidebar 조합을 렌더링한다", () => {
    render(
      <SidebarLayout>
        <Sidebar>
          <SidebarHeader>서비스</SidebarHeader>
          <SidebarContent>
            <SidebarNav label="서비스 메뉴">
              <SidebarGroup>
                <SidebarGroupLabel>메뉴</SidebarGroupLabel>
                <SidebarNavList>
                  <SidebarNavItem>
                    <SidebarNavLink href="/me" active>
                      내 정보
                    </SidebarNavLink>
                  </SidebarNavItem>
                </SidebarNavList>
              </SidebarGroup>
            </SidebarNav>
          </SidebarContent>
          <SidebarFooter>계정</SidebarFooter>
        </Sidebar>

        <SidebarInset>본문</SidebarInset>
      </SidebarLayout>,
    );

    expect(screen.getByText("서비스")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "내 정보" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("본문")).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(<Sidebar data-testid="sidebar" className="custom-sidebar" />);

    expect(screen.getByTestId("sidebar")).toHaveClass("custom-sidebar");
  });
});
