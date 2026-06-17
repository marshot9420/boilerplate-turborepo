import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Breadcrumb, {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

describe("Web Breadcrumb", () => {
  it("nav를 렌더링하고 기본 aria-label을 제공한다", () => {
    render(<Breadcrumb>breadcrumb</Breadcrumb>);

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });

    expect(breadcrumb).toBeInTheDocument();
    expect(breadcrumb).toHaveClass("text-sm", "text-muted-foreground");
  });

  it("label을 지정할 수 있다", () => {
    render(<Breadcrumb label="페이지 경로">breadcrumb</Breadcrumb>);

    expect(screen.getByRole("navigation", { name: "페이지 경로" })).toBeInTheDocument();
  });

  it("BreadcrumbList는 ordered list로 렌더링한다", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>홈</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const list = screen.getByRole("list");

    expect(list.tagName).toBe("OL");
    expect(list).toHaveClass("flex", "flex-wrap", "items-center");
  });

  it("BreadcrumbItem은 listitem으로 렌더링한다", () => {
    render(
      <BreadcrumbList>
        <BreadcrumbItem>홈</BreadcrumbItem>
      </BreadcrumbList>,
    );

    const item = screen.getByRole("listitem");

    expect(item).toHaveTextContent("홈");
    expect(item).toHaveClass("inline-flex", "items-center", "min-w-0");
  });

  it("BreadcrumbLink는 anchor로 렌더링한다", () => {
    render(<BreadcrumbLink href="/contents">콘텐츠</BreadcrumbLink>);

    const link = screen.getByRole("link", { name: "콘텐츠" });

    expect(link).toHaveAttribute("href", "/contents");
    expect(link).toHaveClass("hover:text-foreground", "transition-colors");
  });

  it("BreadcrumbPage는 현재 페이지를 나타낸다", () => {
    render(<BreadcrumbPage>상세</BreadcrumbPage>);

    const page = screen.getByText("상세");

    expect(page).toHaveAttribute("aria-current", "page");
    expect(page).toHaveClass("text-foreground", "font-medium", "truncate");
  });

  it("BreadcrumbSeparator는 기본 구분자를 렌더링한다", () => {
    render(<BreadcrumbSeparator data-testid="separator" />);

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveTextContent("/");
    expect(separator).toHaveAttribute("role", "presentation");
    expect(separator).toHaveAttribute("aria-hidden", "true");
  });

  it("BreadcrumbSeparator children을 지정할 수 있다", () => {
    render(<BreadcrumbSeparator data-testid="separator">›</BreadcrumbSeparator>);

    expect(screen.getByTestId("separator")).toHaveTextContent("›");
  });

  it("BreadcrumbEllipsis를 렌더링한다", () => {
    render(<BreadcrumbEllipsis data-testid="ellipsis" />);

    const ellipsis = screen.getByTestId("ellipsis");

    expect(ellipsis).toHaveTextContent("…");
    expect(ellipsis).toHaveAttribute("aria-hidden", "true");
    expect(ellipsis).toHaveClass("inline-flex", "items-center", "size-6");
  });

  it("전체 breadcrumb 조합을 렌더링한다", () => {
    render(
      <Breadcrumb label="페이지 경로">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">홈</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/contents">콘텐츠</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>상세</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole("navigation", { name: "페이지 경로" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "홈" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "콘텐츠" })).toHaveAttribute("href", "/contents");
    expect(screen.getByText("상세")).toHaveAttribute("aria-current", "page");
  });

  it("className을 병합한다", () => {
    render(
      <Breadcrumb className="custom-breadcrumb" data-testid="breadcrumb">
        breadcrumb
      </Breadcrumb>,
    );

    expect(screen.getByTestId("breadcrumb")).toHaveClass(
      "text-muted-foreground",
      "custom-breadcrumb",
    );
  });

  it("하위 컴포넌트 className을 병합한다", () => {
    render(
      <BreadcrumbList className="custom-list" data-testid="list">
        <BreadcrumbItem className="custom-item" data-testid="item">
          <BreadcrumbLink href="/" className="custom-link" data-testid="link">
            홈
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>,
    );

    expect(screen.getByTestId("list")).toHaveClass("custom-list");
    expect(screen.getByTestId("item")).toHaveClass("custom-item");
    expect(screen.getByTestId("link")).toHaveClass("custom-link");
  });
});
