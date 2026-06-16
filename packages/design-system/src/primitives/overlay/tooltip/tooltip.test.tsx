import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createRef } from "react";

import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const ResizeObserverMock = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
};

let originalResizeObserver: typeof ResizeObserver | undefined;

describe("Tooltip", () => {
  beforeAll(() => {
    originalResizeObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = ResizeObserverMock;
  });

  afterAll(() => {
    if (originalResizeObserver) {
      globalThis.ResizeObserver = originalResizeObserver;
      return;
    }

    Reflect.deleteProperty(globalThis, "ResizeObserver");
  });

  it("defaultOpen이면 tooltip을 렌더링한다", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent>도움말 내용</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByRole("tooltip")).toHaveTextContent("도움말 내용");
  });

  it("trigger에 hover하면 tooltip을 연다", async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent>도움말 내용</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole("button", { name: "도움말" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent("도움말 내용");
  });

  it("size를 data attribute로 노출한다", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent data-testid="tooltip-content" size="lg">
            큰 Tooltip
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByTestId("tooltip-content")).toHaveAttribute("data-size", "lg");
  });

  it("기본 size는 md다", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent data-testid="tooltip-content">기본 Tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByTestId("tooltip-content")).toHaveAttribute("data-size", "md");
  });

  it("className을 병합한다", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent data-testid="tooltip-content" className="custom-tooltip">
            Tooltip
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByTestId("tooltip-content")).toHaveClass("custom-tooltip");
  });

  it("arrow를 렌더링한다", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent>
            Tooltip
            <TooltipArrow data-testid="tooltip-arrow" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByTestId("tooltip-arrow")).toBeInTheDocument();
  });

  it("TooltipContent ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent ref={ref}>Tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
