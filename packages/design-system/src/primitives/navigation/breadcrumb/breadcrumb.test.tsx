import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Breadcrumb, {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

describe("Breadcrumb", () => {
  it("기본 aria-label을 가진 navigation을 렌더링한다", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>현재 페이지</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("label prop으로 navigation label을 변경할 수 있다", () => {
    render(
      <Breadcrumb label="현재 위치">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>현재 페이지</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole("navigation", { name: "현재 위치" })).toBeInTheDocument();
  });

  it("BreadcrumbLink를 링크로 렌더링한다", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">설정</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole("link", { name: "설정" })).toHaveAttribute("href", "/settings");
  });

  it("BreadcrumbPage는 현재 페이지를 aria-current로 표시한다", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>프로필</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByText("프로필")).toHaveAttribute("aria-current", "page");
  });

  it("BreadcrumbSeparator는 장식 요소로 렌더링한다", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">홈</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>설정</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const separator = screen.getByText("/");

    expect(separator).toHaveAttribute("aria-hidden", "true");
    expect(separator).toHaveAttribute("role", "presentation");
  });

  it("className을 병합한다", () => {
    render(
      <Breadcrumb className="custom-breadcrumb">
        <BreadcrumbList className="custom-list">
          <BreadcrumbItem className="custom-item">
            <BreadcrumbLink href="/" className="custom-link">
              홈
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveClass("custom-breadcrumb");

    expect(screen.getByRole("list")).toHaveClass("custom-list");
    expect(screen.getByRole("listitem")).toHaveClass("custom-item");
    expect(screen.getByRole("link", { name: "홈" })).toHaveClass("custom-link");
  });
});
