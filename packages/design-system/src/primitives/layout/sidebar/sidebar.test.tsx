import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

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

describe("Sidebar", () => {
  it("sidebar layout과 sidebar, inset을 렌더링한다", () => {
    render(
      <SidebarLayout>
        <Sidebar>
          <SidebarHeader>Admin</SidebarHeader>
          <SidebarContent>메뉴</SidebarContent>
        </Sidebar>

        <SidebarInset>본문</SidebarInset>
      </SidebarLayout>,
    );

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("메뉴")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("본문");
  });

  it("SidebarLayout은 sidebarWidth를 data attribute와 CSS custom property로 렌더링한다", () => {
    render(
      <SidebarLayout data-testid="layout" sidebarWidth="lg">
        콘텐츠
      </SidebarLayout>,
    );

    const layout = screen.getByTestId("layout");

    expect(layout).toHaveAttribute("data-sidebar-width", "lg");
    expect(layout).toHaveStyle("--ds-sidebar-width: 18rem");
  });

  it("Sidebar는 기본 data attribute를 렌더링한다", () => {
    render(<Sidebar data-testid="sidebar">메뉴</Sidebar>);

    const sidebar = screen.getByTestId("sidebar");

    expect(sidebar.tagName).toBe("ASIDE");
    expect(sidebar).toHaveAttribute("data-variant", "default");
    expect(sidebar).toHaveAttribute("data-sticky", "true");
    expect(sidebar).toHaveAttribute("data-hidden-on-mobile", "true");
  });

  it("Sidebar variant, sticky, hiddenOnMobile 값을 data attribute로 렌더링한다", () => {
    render(
      <Sidebar
        data-testid="sidebar"
        variant="floating"
        sticky={false}
        hiddenOnMobile={false}
      >
        메뉴
      </Sidebar>,
    );

    const sidebar = screen.getByTestId("sidebar");

    expect(sidebar).toHaveAttribute("data-variant", "floating");
    expect(sidebar).toHaveAttribute("data-sticky", "false");
    expect(sidebar).toHaveAttribute("data-hidden-on-mobile", "false");
  });

  it("SidebarNav는 nav label을 렌더링한다", () => {
    render(
      <SidebarNav label="관리자 메뉴">
        <SidebarNavList>
          <SidebarNavItem>
            <SidebarNavLink href="/admin">대시보드</SidebarNavLink>
          </SidebarNavItem>
        </SidebarNavList>
      </SidebarNav>,
    );

    expect(
      screen.getByRole("navigation", { name: "관리자 메뉴" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "대시보드" })).toHaveAttribute(
      "href",
      "/admin",
    );
  });

  it("active SidebarNavLink는 aria-current page를 렌더링한다", () => {
    render(
      <SidebarNav label="관리자 메뉴">
        <SidebarNavList>
          <SidebarNavItem>
            <SidebarNavLink href="/admin" active>
              대시보드
            </SidebarNavLink>
          </SidebarNavItem>
        </SidebarNavList>
      </SidebarNav>,
    );

    const link = screen.getByRole("link", { name: "대시보드" });

    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("data-active", "true");
    expect(link).toHaveAttribute("data-tone", "default");
  });

  it("SidebarNavLink는 aria-current를 직접 지정할 수 있다", () => {
    render(
      <SidebarNavLink href="/admin" active aria-current="step">
        단계
      </SidebarNavLink>,
    );

    expect(screen.getByRole("link", { name: "단계" })).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("danger tone을 data attribute로 렌더링한다", () => {
    render(
      <SidebarNavLink href="/logout" tone="danger">
        로그아웃
      </SidebarNavLink>,
    );

    expect(screen.getByRole("link", { name: "로그아웃" })).toHaveAttribute(
      "data-tone",
      "danger",
    );
  });

  it("SidebarSeparator를 separator role로 렌더링한다", () => {
    render(<SidebarSeparator />);

    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("SidebarGroup과 SidebarGroupLabel을 렌더링한다", () => {
    render(
      <SidebarGroup>
        <SidebarGroupLabel>콘텐츠 관리</SidebarGroupLabel>
      </SidebarGroup>,
    );

    expect(screen.getByText("콘텐츠 관리")).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(
      <SidebarLayout className="custom-layout">
        <Sidebar className="custom-sidebar">
          <SidebarHeader className="custom-header">Header</SidebarHeader>
          <SidebarContent className="custom-content">
            <SidebarGroup className="custom-group">
              <SidebarGroupLabel className="custom-group-label">
                그룹
              </SidebarGroupLabel>
              <SidebarNav className="custom-nav">
                <SidebarNavList className="custom-list">
                  <SidebarNavItem className="custom-item">
                    <SidebarNavLink href="/" className="custom-link">
                      홈
                    </SidebarNavLink>
                  </SidebarNavItem>
                </SidebarNavList>
              </SidebarNav>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="custom-footer">Footer</SidebarFooter>
        </Sidebar>

        <SidebarInset className="custom-inset">본문</SidebarInset>
      </SidebarLayout>,
    );

    expect(screen.getByText("Header").parentElement).toHaveClass(
      "custom-sidebar",
    );
    expect(screen.getByText("Header")).toHaveClass("custom-header");
    expect(screen.getByText("그룹").closest(".custom-content")).toBeTruthy();
    expect(screen.getByText("그룹").parentElement).toHaveClass("custom-group");
    expect(screen.getByText("그룹")).toHaveClass("custom-group-label");
    expect(screen.getByRole("navigation")).toHaveClass("custom-nav");
    expect(screen.getByRole("list")).toHaveClass("custom-list");
    expect(screen.getByRole("listitem")).toHaveClass("custom-item");
    expect(screen.getByRole("link", { name: "홈" })).toHaveClass("custom-link");
    expect(screen.getByText("Footer")).toHaveClass("custom-footer");
    expect(screen.getByRole("main")).toHaveClass("custom-inset");
  });

  it("Sidebar ref를 전달한다", () => {
    const ref = createRef<HTMLElement>();

    render(<Sidebar ref={ref}>메뉴</Sidebar>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("ASIDE");
    expect(ref.current).toHaveTextContent("메뉴");
  });

  it("SidebarNavLink ref를 전달한다", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <SidebarNavLink ref={ref} href="/">
        홈
      </SidebarNavLink>,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current).toHaveTextContent("홈");
  });
});
