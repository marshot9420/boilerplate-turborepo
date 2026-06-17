import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import Tooltip, { TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("Web Tooltip", () => {
  beforeAll(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("trigger에 hover하면 tooltip을 표시한다", async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent data-testid="content">도움말 내용</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole("button", { name: "도움말" }));

    expect(await screen.findByTestId("content")).toHaveTextContent("도움말 내용");
    expect(await screen.findByRole("tooltip")).toHaveTextContent("도움말 내용");
  });

  it("Escape를 누르면 tooltip을 숨긴다", async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>도움말</TooltipTrigger>
          <TooltipContent data-testid="content">도움말 내용</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole("button", { name: "도움말" }));

    expect(await screen.findByTestId("content")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    });
  });

  it("content 기본 size는 md이다", async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>정보</TooltipTrigger>
          <TooltipContent data-testid="content">도움말 내용</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole("button", { name: "정보" }));

    const content = await screen.findByTestId("content");

    expect(content).toHaveAttribute("data-size", "md");
    expect(content).toHaveClass("max-w-64", "bg-foreground", "text-background", "shadow-lg");
  });

  it("content size를 지정할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>정보</TooltipTrigger>
          <TooltipContent data-testid="content" size="lg">
            도움말 내용
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole("button", { name: "정보" }));

    const content = await screen.findByTestId("content");

    expect(content).toHaveAttribute("data-size", "lg");
    expect(content).toHaveClass("max-w-80");
  });

  it("sm size를 지정할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>정보</TooltipTrigger>
          <TooltipContent data-testid="content" size="sm">
            도움말 내용
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole("button", { name: "정보" }));

    const content = await screen.findByTestId("content");

    expect(content).toHaveAttribute("data-size", "sm");
    expect(content).toHaveClass("max-w-48");
  });

  it("TooltipArrow를 렌더링한다", async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip open>
          <TooltipTrigger>정보</TooltipTrigger>
          <TooltipContent data-testid="content">
            도움말 내용
            <TooltipArrow data-testid="arrow" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(await screen.findByTestId("content")).toBeInTheDocument();
    expect(screen.getByTestId("arrow")).toHaveClass("fill-foreground");
  });

  it("className을 병합한다", async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>정보</TooltipTrigger>
          <TooltipContent data-testid="content" className="custom-tooltip">
            도움말 내용
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole("button", { name: "정보" }));

    expect(await screen.findByTestId("content")).toHaveClass("bg-foreground", "custom-tooltip");
  });
});
