import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import Separator from "./separator";

describe("Admin Separator", () => {
  it("decorative separator를 기본값으로 렌더링한다", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveAttribute("role", "none");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
    expect(separator).toHaveAttribute("data-decorative", "true");
    expect(separator).not.toHaveAttribute("aria-orientation");
  });

  it("decorative가 false이면 separator role과 aria-orientation을 가진다", () => {
    render(<Separator decorative={false} />);

    const separator = screen.getByRole("separator");

    expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    expect(separator).toHaveAttribute("data-decorative", "false");
  });

  it("vertical orientation을 적용한다", () => {
    render(<Separator data-testid="separator" orientation="vertical" decorative={false} />);

    const separator = screen.getByRole("separator");

    expect(separator).toHaveAttribute("data-orientation", "vertical");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
  });

  it("variant를 적용한다", () => {
    render(<Separator data-testid="separator" variant="strong" />);

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveAttribute("data-variant", "strong");
  });

  it("horizontal spacing을 적용한다", () => {
    render(<Separator data-testid="separator" spacing="md" />);

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveAttribute("data-spacing", "md");
    expect(separator).toHaveClass("my-4");
  });

  it("vertical spacing을 적용한다", () => {
    render(<Separator data-testid="separator" orientation="vertical" spacing="lg" />);

    const separator = screen.getByTestId("separator");

    expect(separator).toHaveAttribute("data-spacing", "lg");
    expect(separator).toHaveClass("mx-6");
  });

  it("className을 병합한다", () => {
    render(<Separator data-testid="separator" className="custom-separator" />);

    expect(screen.getByTestId("separator")).toHaveClass("custom-separator");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Separator ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
