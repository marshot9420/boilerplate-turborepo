import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Grid from "./grid";

describe("Grid", () => {
  it("children을 렌더링한다", () => {
    render(
      <Grid>
        <span>첫 번째</span>
        <span>두 번째</span>
      </Grid>,
    );

    expect(screen.getByText("첫 번째")).toBeInTheDocument();
    expect(screen.getByText("두 번째")).toBeInTheDocument();
  });

  it("기본 data attribute를 렌더링한다", () => {
    render(<Grid data-testid="grid">콘텐츠</Grid>);

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveAttribute("data-columns", "1");
    expect(grid).toHaveAttribute("data-gap", "md");
    expect(grid).toHaveAttribute("data-align", "stretch");
    expect(grid).toHaveAttribute("data-justify", "stretch");
  });

  it("반응형 column prop을 data attribute로 렌더링한다", () => {
    render(
      <Grid
        data-testid="grid"
        columns={1}
        smColumns={2}
        mdColumns={3}
        lgColumns={4}
        gap="lg"
        align="center"
        justify="center"
      >
        콘텐츠
      </Grid>,
    );

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveAttribute("data-columns", "1");
    expect(grid).toHaveAttribute("data-sm-columns", "2");
    expect(grid).toHaveAttribute("data-md-columns", "3");
    expect(grid).toHaveAttribute("data-lg-columns", "4");
    expect(grid).toHaveAttribute("data-gap", "lg");
    expect(grid).toHaveAttribute("data-align", "center");
    expect(grid).toHaveAttribute("data-justify", "center");
  });

  it("선택한 column class를 렌더링한다", () => {
    render(
      <Grid data-testid="grid" columns={3} smColumns={4} mdColumns={6} lgColumns={12}>
        콘텐츠
      </Grid>,
    );

    const grid = screen.getByTestId("grid");

    expect(grid).toHaveClass("grid-cols-3");
    expect(grid).toHaveClass("sm:grid-cols-4");
    expect(grid).toHaveClass("md:grid-cols-6");
    expect(grid).toHaveClass("lg:grid-cols-12");
  });

  it("className을 병합한다", () => {
    render(
      <Grid data-testid="grid" className="custom-grid">
        콘텐츠
      </Grid>,
    );

    expect(screen.getByTestId("grid")).toHaveClass("custom-grid");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Grid ref={ref}>콘텐츠</Grid>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveTextContent("콘텐츠");
  });
});
