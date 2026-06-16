import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Field from "./field";

describe("Field", () => {
  it("children을 렌더링한다", () => {
    render(
      <Field>
        <span>필드 내용</span>
      </Field>,
    );

    expect(screen.getByText("필드 내용")).toBeInTheDocument();
  });

  it("기본 상태를 data attribute로 노출한다", () => {
    render(<Field data-testid="field" />);

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("data-direction", "vertical");
    expect(field).toHaveAttribute("data-full-width", "false");
    expect(field).toHaveAttribute("data-invalid", "false");
    expect(field).toHaveAttribute("data-disabled", "false");
  });

  it("direction, fullWidth, hasError, disabled 상태를 data attribute로 노출한다", () => {
    render(<Field data-testid="field" direction="horizontal" fullWidth hasError disabled />);

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("data-direction", "horizontal");
    expect(field).toHaveAttribute("data-full-width", "true");
    expect(field).toHaveAttribute("data-invalid", "true");
    expect(field).toHaveAttribute("data-disabled", "true");
  });

  it("className을 병합한다", () => {
    render(<Field data-testid="field" className="custom-field" />);

    expect(screen.getByTestId("field")).toHaveClass("custom-field");
  });

  it("ref를 div element로 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Field ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
