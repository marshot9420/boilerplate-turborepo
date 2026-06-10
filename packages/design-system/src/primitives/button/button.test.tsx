import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("children을 렌더링한다", () => {
    render(<Button>저장</Button>);

    expect(
      screen.getByRole("button", {
        name: "저장",
      }),
    ).toBeInTheDocument();
  });

  it("기본 type은 button이다", () => {
    render(<Button>저장</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("loading 상태에서는 disabled 처리된다", () => {
    render(<Button loading>저장</Button>);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-loading", "true");
  });

  it("클릭 이벤트를 실행한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>저장</Button>);

    await user.click(
      screen.getByRole("button", {
        name: "저장",
      }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
