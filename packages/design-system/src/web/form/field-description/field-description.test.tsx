import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import FieldDescription from "./field-description";

describe("Web FieldDescription", () => {
  it("children을 렌더링한다", () => {
    render(<FieldDescription>보조 설명입니다.</FieldDescription>);

    expect(screen.getByText("보조 설명입니다.")).toBeInTheDocument();
  });

  it("기본 data attribute를 가진다", () => {
    render(<FieldDescription>설명</FieldDescription>);

    const description = screen.getByText("설명");

    expect(description).toHaveAttribute("data-size", "md");
    expect(description).toHaveAttribute("data-tone", "default");
    expect(description).toHaveAttribute("data-disabled", "false");
  });

  it("disabled 상태를 적용한다", () => {
    render(<FieldDescription disabled>설명</FieldDescription>);

    const description = screen.getByText("설명");

    expect(description).toHaveAttribute("data-disabled", "true");
    expect(description).toHaveClass("data-[disabled=true]:opacity-50");
  });

  it("size를 적용한다", () => {
    render(<FieldDescription size="sm">설명</FieldDescription>);

    const description = screen.getByText("설명");

    expect(description).toHaveAttribute("data-size", "sm");
    expect(description).toHaveClass("text-xs");
  });

  it("tone을 적용한다", () => {
    render(<FieldDescription tone="subtle">설명</FieldDescription>);

    const description = screen.getByText("설명");

    expect(description).toHaveAttribute("data-tone", "subtle");
    expect(description).toHaveClass("text-muted-foreground/75");
  });

  it("className을 병합한다", () => {
    render(<FieldDescription className="custom-description">설명</FieldDescription>);

    expect(screen.getByText("설명")).toHaveClass("custom-description");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLParagraphElement>();

    render(<FieldDescription ref={ref}>설명</FieldDescription>);

    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});
