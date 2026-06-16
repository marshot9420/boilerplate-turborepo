import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createRef } from "react";

import LinkButton from "./link-button";

describe("Web LinkButton", () => {
  it("link button을 렌더링한다", () => {
    render(<LinkButton href="/contents">콘텐츠</LinkButton>);

    const link = screen.getByRole("link", {
      name: "콘텐츠",
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/contents");
    expect(link).toHaveAttribute("data-ds-component", "link-button");
  });

  it("web link button 스타일을 적용한다", () => {
    render(<LinkButton href="/contents">콘텐츠</LinkButton>);

    const link = screen.getByRole("link", {
      name: "콘텐츠",
    });

    expect(link).toHaveClass("rounded-full");
    expect(link).toHaveClass("shadow-sm");
  });

  it("variant, size, fullWidth 상태를 전달한다", () => {
    render(
      <LinkButton fullWidth href="/contents" size="lg" variant="outline">
        자세히 보기
      </LinkButton>,
    );

    const link = screen.getByRole("link", {
      name: "자세히 보기",
    });

    expect(link).toHaveAttribute("data-variant", "outline");
    expect(link).toHaveAttribute("data-size", "lg");
    expect(link).toHaveAttribute("data-full-width", "true");
  });

  it("disabled 상태면 aria-disabled와 tabIndex를 적용한다", () => {
    render(
      <LinkButton disabled href="/contents">
        콘텐츠
      </LinkButton>,
    );

    const link = screen.getByRole("link", {
      name: "콘텐츠",
    });

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).toHaveAttribute("data-disabled", "true");
  });

  it("disabled 상태면 클릭 이벤트를 호출하지 않는다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <LinkButton disabled href="/contents" onClick={handleClick}>
        콘텐츠
      </LinkButton>,
    );

    await user.click(
      screen.getByRole("link", {
        name: "콘텐츠",
      }),
    );

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("leftSlot과 rightSlot을 렌더링한다", () => {
    render(
      <LinkButton
        href="/next"
        leftSlot={<span data-testid="left-slot">←</span>}
        rightSlot={<span data-testid="right-slot">→</span>}
      >
        다음
      </LinkButton>,
    );

    expect(screen.getByTestId("left-slot")).toBeInTheDocument();
    expect(screen.getByText("다음")).toBeInTheDocument();
    expect(screen.getByTestId("right-slot")).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(
      <LinkButton className="custom-class" href="/contents">
        콘텐츠
      </LinkButton>,
    );

    const link = screen.getByRole("link", {
      name: "콘텐츠",
    });

    expect(link).toHaveClass("custom-class");
    expect(link).toHaveClass("rounded-full");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <LinkButton ref={ref} href="/contents">
        콘텐츠
      </LinkButton>,
    );

    const link = screen.getByRole("link", {
      name: "콘텐츠",
    });

    expect(ref.current).toBe(link);
  });

  it("클릭 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <LinkButton href="/contents" onClick={handleClick}>
        콘텐츠
      </LinkButton>,
    );

    await user.click(
      screen.getByRole("link", {
        name: "콘텐츠",
      }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
