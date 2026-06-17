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

describe("Admin Sidebar", () => {
  it("sidebar layout을 렌더링하고 width css variable을 설정한다", () => {
    render(<SidebarLayout data-testid="layout" sidebarWidth="lg" />);

    const layout = screen.getByTestId("layout");

    expect(layout).toHaveAttribute("data-sidebar-width", "lg");
    expect(layout).toHaveClass("lg:grid", "lg:grid-cols-[var(--ds-sidebar-width)_minmax(0,1fr)]");
    expect(layout.style.getPropertyValue("--ds-sidebar-width")).toBe("18rem");
  });

  it("sidebar 기본 상태를 렌더링한다", () => {
    render(<Sidebar data-testid="sidebar">사이드바</Sidebar>);

    const sidebar = screen.getByTestId("sidebar");

    expect(sidebar.tagName).toBe("ASIDE");
    expect(sidebar).toHaveAttribute("data-variant", "default");
    expect(sidebar).toHaveAttribute("data-sticky", "true");
    expect(sidebar).toHaveAttribute("data-hidden-on-mobile", "true");
    expect(sidebar).toHaveClass("hidden", "lg:flex", "lg:sticky", "lg:top-0");
  });

  it("floating variant를 반영한다", () => {
    render(
      <Sidebar data-testid="sidebar" variant="floating">
        사이드바
      </Sidebar>,
    );

    const sidebar = screen.getByTestId("sidebar");

    expect(sidebar).toHaveAttribute("data-variant", "floating");
    expect(sidebar).toHaveClass("rounded-lg", "border", "shadow-sm");
  });

  it("hiddenOnMobile=false를 반영한다", () => {
    render(
      <Sidebar data-testid="sidebar" hiddenOnMobile={false}>
        사이드바
      </Sidebar>,
    );

    const sidebar = screen.getByTestId("sidebar");

    expect(sidebar).toHaveAttribute("data-hidden-on-mobile", "false");
    expect(sidebar).toHaveClass("flex");
    expect(sidebar).not.toHaveClass("hidden");
  });

  it("sticky=false를 반영한다", () => {
    render(
      <Sidebar data-testid="sidebar" sticky={false}>
        사이드바
      </Sidebar>,
    );

    const sidebar = screen.getByTestId("sidebar");

    expect(sidebar).toHaveAttribute("data-sticky", "false");
    expect(sidebar).not.toHaveClass("lg:sticky");
  });

  it("SidebarInset은 main으로 렌더링한다", () => {
    render(<SidebarInset data-testid="inset">본문</SidebarInset>);

    const inset = screen.getByTestId("inset");

    expect(inset.tagName).toBe("MAIN");
    expect(inset).toHaveClass("bg-background", "min-w-0", "flex-1");
  });

  it("header, content, footer를 렌더링한다", () => {
    render(
      <Sidebar>
        <SidebarHeader>헤더</SidebarHeader>
        <SidebarContent>콘텐츠</SidebarContent>
        <SidebarFooter>푸터</SidebarFooter>
      </Sidebar>,
    );

    expect(screen.getByText("헤더")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠")).toBeInTheDocument();
    expect(screen.getByText("푸터")).toBeInTheDocument();
  });

  it("group과 group label을 렌더링한다", () => {
    render(
      <SidebarGroup>
        <SidebarGroupLabel>관리</SidebarGroupLabel>
      </SidebarGroup>,
    );

    expect(screen.getByText("관리")).toBeInTheDocument();
  });

  it("nav 기본 aria-label을 제공한다", () => {
    render(<SidebarNav>메뉴</SidebarNav>);

    expect(screen.getByRole("navigation", { name: "Sidebar navigation" })).toBeInTheDocument();
  });

  it("nav label을 지정할 수 있다", () => {
    render(<SidebarNav label="관리자 메뉴">메뉴</SidebarNav>);

    expect(screen.getByRole("navigation", { name: "관리자 메뉴" })).toBeInTheDocument();
  });

  it("nav list, item, link를 렌더링한다", () => {
    render(
      <SidebarNav label="관리자 메뉴">
        <SidebarNavList>
          <SidebarNavItem>
            <SidebarNavLink href="/admin">대시보드</SidebarNavLink>
          </SidebarNavItem>
        </SidebarNavList>
      </SidebarNav>,
    );

    const link = screen.getByRole("link", { name: "대시보드" });

    expect(link).toHaveAttribute("href", "/admin");
  });

  it("active link는 aria-current와 data-active를 가진다", () => {
    render(
      <SidebarNavLink href="/admin" active>
        대시보드
      </SidebarNavLink>,
    );

    const link = screen.getByRole("link", { name: "대시보드" });

    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("data-active", "true");
  });

  it("aria-current를 직접 지정하면 우선 사용한다", () => {
    render(
      <SidebarNavLink href="/admin" active aria-current="step">
        대시보드
      </SidebarNavLink>,
    );

    expect(screen.getByRole("link", { name: "대시보드" })).toHaveAttribute("aria-current", "step");
  });

  it("danger tone을 반영한다", () => {
    render(
      <SidebarNavLink href="/admin/delete" tone="danger">
        삭제
      </SidebarNavLink>,
    );

    const link = screen.getByRole("link", { name: "삭제" });

    expect(link).toHaveAttribute("data-tone", "danger");
    expect(link).toHaveClass("text-destructive");
  });

  it("separator를 렌더링한다", () => {
    render(<SidebarSeparator data-testid="separator" />);

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveAttribute("role", "separator");
    expect(separator).toHaveClass("bg-border", "h-px");
  });

  it("전체 sidebar 조합을 렌더링한다", () => {
    render(
      <SidebarLayout>
        <Sidebar>
          <SidebarHeader>관리자</SidebarHeader>
          <SidebarContent>
            <SidebarNav label="관리자 메뉴">
              <SidebarGroup>
                <SidebarGroupLabel>메뉴</SidebarGroupLabel>
                <SidebarNavList>
                  <SidebarNavItem>
                    <SidebarNavLink href="/admin" active>
                      대시보드
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

    expect(screen.getByText("관리자")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "대시보드" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("본문")).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(<Sidebar data-testid="sidebar" className="custom-sidebar" />);

    expect(screen.getByTestId("sidebar")).toHaveClass("custom-sidebar");
  });
});
