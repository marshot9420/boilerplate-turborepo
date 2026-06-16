import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import Field from "./field";

describe("Admin Field", () => {
  it("children을 렌더링한다", () => {
    render(<Field data-testid="field">필드 콘텐츠</Field>);

    expect(screen.getByText("필드 콘텐츠")).toBeInTheDocument();
  });

  it("기본 direction과 spacing data attribute를 가진다", () => {
    render(<Field data-testid="field" />);

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("data-direction", "vertical");
    expect(field).toHaveAttribute("data-spacing", "md");
  });

  it("horizontal direction을 적용한다", () => {
    render(<Field data-testid="field" direction="horizontal" />);

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("data-direction", "horizontal");
    expect(field).toHaveClass("sm:grid-cols-[12rem_1fr]");
  });

  it("fullWidth를 적용한다", () => {
    render(<Field data-testid="field" fullWidth />);

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("data-full-width", "true");
    expect(field).toHaveClass("w-full");
  });

  it("hasError 상태를 적용한다", () => {
    render(<Field data-testid="field" hasError />);

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("data-invalid", "true");
  });

  it("disabled 상태를 적용한다", () => {
    render(<Field data-testid="field" disabled />);

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("data-disabled", "true");
    expect(field).toHaveClass("data-[disabled=true]:opacity-60");
  });

  it("spacing을 적용한다", () => {
    render(<Field data-testid="field" spacing="lg" />);

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("data-spacing", "lg");
    expect(field).toHaveClass("gap-3");
  });

  it("className을 병합한다", () => {
    render(<Field data-testid="field" className="custom-field" />);

    expect(screen.getByTestId("field")).toHaveClass("custom-field");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Field ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
