import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Separator from "./separator";

describe("Separator", () => {
  it("기본 orientation은 horizontal이다", () => {
    render(<Separator data-testid="separator" />);

    expect(screen.getByTestId("separator")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("전달한 orientation을 data attribute로 노출한다", () => {
    render(<Separator data-testid="separator" orientation="vertical" />);

    expect(screen.getByTestId("separator")).toHaveAttribute("data-orientation", "vertical");
  });

  it("기본 decorative 상태는 true이고 role은 none이다", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveAttribute("data-decorative", "true");
    expect(separator).toHaveAttribute("role", "none");
    expect(separator).not.toHaveAttribute("aria-orientation");
  });

  it("decorative가 false이면 separator role과 aria-orientation을 노출한다", () => {
    render(<Separator decorative={false} />);

    const separator = screen.getByRole("separator");

    expect(separator).toHaveAttribute("data-decorative", "false");
    expect(separator).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("vertical separator의 aria-orientation을 노출한다", () => {
    render(<Separator decorative={false} orientation="vertical" />);

    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("orientation에 따라 class를 적용한다", () => {
    render(<Separator data-testid="separator" orientation="vertical" />);

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveClass("h-full");
    expect(separator).toHaveClass("w-px");
  });

  it("className을 병합한다", () => {
    render(<Separator data-testid="separator" className="custom-separator" />);

    expect(screen.getByTestId("separator")).toHaveClass("custom-separator");
  });

  it("ref를 div element로 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Separator ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
