import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Grid from "./grid";

describe("Admin Grid", () => {
  it("children을 렌더링한다", () => {
    render(
      <Grid data-testid="grid">
        <span>관리자 카드</span>
      </Grid>,
    );

    expect(screen.getByText("관리자 카드")).toBeInTheDocument();
  });

  it("기본값은 columns=1, gap=md, align=stretch, justify=stretch이다", () => {
    render(<Grid data-testid="grid" />);

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveAttribute("data-columns", "1");
    expect(grid).toHaveAttribute("data-gap", "md");
    expect(grid).toHaveAttribute("data-align", "stretch");
    expect(grid).toHaveAttribute("data-justify", "stretch");
    expect(grid).toHaveClass(
      "grid",
      "grid-cols-1",
      "gap-4",
      "items-stretch",
      "justify-items-stretch",
    );
  });

  it("columns를 지정할 수 있다", () => {
    render(<Grid data-testid="grid" columns={3} />);

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveAttribute("data-columns", "3");
    expect(grid).toHaveClass("grid-cols-3");
  });

  it("responsive columns를 지정할 수 있다", () => {
    render(<Grid data-testid="grid" columns={1} smColumns={2} mdColumns={3} lgColumns={4} />);

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveAttribute("data-sm-columns", "2");
    expect(grid).toHaveAttribute("data-md-columns", "3");
    expect(grid).toHaveAttribute("data-lg-columns", "4");
    expect(grid).toHaveClass("grid-cols-1", "sm:grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4");
  });

  it("gap을 지정할 수 있다", () => {
    render(<Grid data-testid="grid" gap="xl" />);

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveAttribute("data-gap", "xl");
    expect(grid).toHaveClass("gap-8");
  });

  it("gap none을 지정할 수 있다", () => {
    render(<Grid data-testid="grid" gap="none" />);

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveAttribute("data-gap", "none");
    expect(grid).not.toHaveClass("gap-1");
    expect(grid).not.toHaveClass("gap-2");
    expect(grid).not.toHaveClass("gap-4");
    expect(grid).not.toHaveClass("gap-6");
    expect(grid).not.toHaveClass("gap-8");
  });

  it("align을 지정할 수 있다", () => {
    render(<Grid data-testid="grid" align="center" />);

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveAttribute("data-align", "center");
    expect(grid).toHaveClass("items-center");
  });

  it("justify를 지정할 수 있다", () => {
    render(<Grid data-testid="grid" justify="end" />);

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveAttribute("data-justify", "end");
    expect(grid).toHaveClass("justify-items-end");
  });

  it("className을 병합한다", () => {
    render(<Grid data-testid="grid" className="custom-grid" />);

    expect(screen.getByTestId("grid")).toHaveClass("min-w-0", "custom-grid");
  });

  it("HTML div 속성을 전달한다", () => {
    render(<Grid data-testid="grid" id="admin-grid" />);

    expect(screen.getByTestId("grid")).toHaveAttribute("id", "admin-grid");
  });
});
