import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRef } from "react";

import LinkButton from "./link-button";

describe("LinkButton", () => {
  it("link를 렌더링한다", () => {
    render(<LinkButton href="/login">로그인</LinkButton>);

    const link = screen.getByRole("link", { name: "로그인" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });

  it("className을 병합한다", () => {
    render(
      <LinkButton href="/login" className="custom-link-button">
        로그인
      </LinkButton>,
    );

    expect(screen.getByRole("link", { name: "로그인" })).toHaveClass(
      "custom-link-button",
    );
  });

  it("variant, size, fullWidth 상태를 data attribute로 노출한다", () => {
    render(
      <LinkButton href="/delete" variant="destructive" size="lg" fullWidth>
        삭제
      </LinkButton>,
    );

    const link = screen.getByRole("link", { name: "삭제" });

    expect(link).toHaveAttribute("data-variant", "destructive");
    expect(link).toHaveAttribute("data-size", "lg");
    expect(link).toHaveAttribute("data-full-width", "true");
  });

  it("기본 상태를 data attribute로 노출한다", () => {
    render(<LinkButton href="/login">로그인</LinkButton>);

    const link = screen.getByRole("link", { name: "로그인" });

    expect(link).toHaveAttribute("data-variant", "default");
    expect(link).toHaveAttribute("data-size", "md");
    expect(link).toHaveAttribute("data-disabled", "false");
    expect(link).toHaveAttribute("data-full-width", "false");
  });

  it("클릭 이벤트를 호출한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <LinkButton href="/login" onClick={handleClick}>
        로그인
      </LinkButton>,
    );

    await user.click(screen.getByRole("link", { name: "로그인" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서는 aria-disabled와 tabIndex를 노출하고 클릭 이벤트를 호출하지 않는다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <LinkButton href="/login" disabled onClick={handleClick}>
        로그인
      </LinkButton>,
    );

    const link = screen.getByRole("link", { name: "로그인" });

    await user.click(link);

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("data-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("leftSlot과 rightSlot을 렌더링한다", () => {
    render(
      <LinkButton
        href="/page"
        leftSlot={<span data-testid="left-slot">L</span>}
        rightSlot={<span data-testid="right-slot">R</span>}
      >
        이동
      </LinkButton>,
    );

    const link = screen.getByRole("link");

    expect(screen.getByTestId("left-slot")).toBeInTheDocument();
    expect(screen.getByTestId("right-slot")).toBeInTheDocument();
    expect(link).toHaveTextContent("L이동R");
  });

  it("ref를 anchor element로 전달한다", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <LinkButton ref={ref} href="/login">
        로그인
      </LinkButton>,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
