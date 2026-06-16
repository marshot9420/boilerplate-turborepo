import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import Card from "./card";

describe("Card", () => {
  it("children을 렌더링한다", () => {
    render(<Card>카드 내용</Card>);

    expect(screen.getByText("카드 내용")).toBeInTheDocument();
  });

  it("기본 padding과 fullWidth 상태를 data attribute로 노출한다", () => {
    render(<Card data-testid="card">카드</Card>);

    const card = screen.getByTestId("card");

    expect(card).toHaveAttribute("data-padding", "md");
    expect(card).toHaveAttribute("data-full-width", "false");
  });

  it("전달한 padding과 fullWidth 상태를 data attribute로 노출한다", () => {
    render(
      <Card data-testid="card" padding="lg" fullWidth>
        카드
      </Card>,
    );

    const card = screen.getByTestId("card");

    expect(card).toHaveAttribute("data-padding", "lg");
    expect(card).toHaveAttribute("data-full-width", "true");
  });

  it("padding class를 적용한다", () => {
    render(
      <Card data-testid="card" padding="none">
        카드
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveClass("p-0");
  });

  it("fullWidth가 true이면 w-full class를 적용한다", () => {
    render(
      <Card data-testid="card" fullWidth>
        카드
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveClass("w-full");
  });

  it("className을 병합한다", () => {
    render(<Card className="custom-card">카드</Card>);

    expect(screen.getByText("카드")).toHaveClass("custom-card");
  });

  it("ref를 div element로 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Card ref={ref}>카드</Card>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
