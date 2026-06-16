import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./popover";

describe("Popover", () => {
  it("trigger를 클릭하면 popover를 연다", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent>Popover Content</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByText("Popover Content")).toBeInTheDocument();
  });

  it("close를 클릭하면 popover를 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent>
          <p>Popover Content</p>
          <PopoverClose>닫기</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));
    expect(screen.getByText("Popover Content")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();
  });

  it("defaultOpen이면 처음부터 content를 렌더링한다", () => {
    render(
      <Popover defaultOpen>
        <PopoverContent>기본 열린 Popover</PopoverContent>
      </Popover>,
    );

    expect(screen.getByText("기본 열린 Popover")).toBeInTheDocument();
  });

  it("size를 data attribute로 노출한다", () => {
    render(
      <Popover defaultOpen>
        <PopoverContent size="lg">큰 Popover</PopoverContent>
      </Popover>,
    );

    expect(screen.getByText("큰 Popover")).toHaveAttribute("data-size", "lg");
  });

  it("기본 size는 md다", () => {
    render(
      <Popover defaultOpen>
        <PopoverContent>기본 Popover</PopoverContent>
      </Popover>,
    );

    expect(screen.getByText("기본 Popover")).toHaveAttribute("data-size", "md");
  });

  it("className을 병합한다", () => {
    render(
      <Popover defaultOpen>
        <PopoverContent className="custom-popover">Popover</PopoverContent>
      </Popover>,
    );

    expect(screen.getByText("Popover")).toHaveClass("custom-popover");
  });

  it("ref를 content element로 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Popover defaultOpen>
        <PopoverContent ref={ref}>Popover</PopoverContent>
      </Popover>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
