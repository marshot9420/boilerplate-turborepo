import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import Card from "./card";

describe("Web Card", () => {
  it("콘텐츠를 렌더링한다", () => {
    render(<Card>서비스 카드</Card>);

    expect(screen.getByText("서비스 카드")).toBeInTheDocument();
  });

  it("기본 variant와 padding data attribute를 가진다", () => {
    render(<Card>카드</Card>);

    const card = screen.getByText("카드");

    expect(card).toHaveAttribute("data-variant", "default");
    expect(card).toHaveAttribute("data-padding", "md");
  });

  it("padding과 fullWidth primitive prop을 전달한다", () => {
    render(
      <Card padding="lg" fullWidth>
        카드
      </Card>,
    );

    const card = screen.getByText("카드");

    expect(card).toHaveAttribute("data-padding", "lg");
    expect(card).toHaveAttribute("data-full-width", "true");
  });

  it("variant를 적용한다", () => {
    render(<Card variant="elevated">카드</Card>);

    expect(screen.getByText("카드")).toHaveAttribute("data-variant", "elevated");
  });

  it("interactive 상태를 적용한다", () => {
    render(<Card interactive>카드</Card>);

    const card = screen.getByText("카드");

    expect(card).toHaveAttribute("data-interactive", "true");
    expect(card).toHaveClass("cursor-pointer");
  });

  it("className을 병합한다", () => {
    render(<Card className="custom-card">카드</Card>);

    expect(screen.getByText("카드")).toHaveClass("custom-card");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Card ref={ref}>카드</Card>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
