import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Popover, { PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger } from "./popover";

describe("Web Popover", () => {
  it("trigger를 클릭하면 popover를 연다", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>도움말 열기</PopoverTrigger>
        <PopoverContent data-testid="content">도움말 콘텐츠</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "도움말 열기" }));

    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByText("도움말 콘텐츠")).toBeInTheDocument();
  });

  it("close를 클릭하면 popover를 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>도움말 열기</PopoverTrigger>
        <PopoverContent data-testid="content">
          <span>도움말 콘텐츠</span>
          <PopoverClose>닫기</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "도움말 열기" }));

    expect(screen.getByTestId("content")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "닫기" }));

    await waitFor(() => {
      expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    });
  });

  it("content 기본 size는 md이다", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent data-testid="content">콘텐츠</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const content = screen.getByTestId("content");

    expect(content).toHaveAttribute("data-size", "md");
    expect(content).toHaveClass("w-72", "bg-surface", "shadow-xl");
  });

  it("content size를 지정할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent data-testid="content" size="lg">
          콘텐츠
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const content = screen.getByTestId("content");

    expect(content).toHaveAttribute("data-size", "lg");
    expect(content).toHaveClass("w-96");
  });

  it("sm size를 지정할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent data-testid="content" size="sm">
          콘텐츠
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const content = screen.getByTestId("content");

    expect(content).toHaveAttribute("data-size", "sm");
    expect(content).toHaveClass("w-56");
  });

  it("PopoverAnchor를 렌더링할 수 있다", () => {
    render(
      <Popover open>
        <PopoverAnchor data-testid="anchor">기준점</PopoverAnchor>
        <PopoverContent data-testid="content">콘텐츠</PopoverContent>
      </Popover>,
    );

    expect(screen.getByTestId("anchor")).toHaveTextContent("기준점");
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("className을 병합한다", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent data-testid="content" className="custom-popover">
          콘텐츠
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByTestId("content")).toHaveClass("bg-surface", "custom-popover");
  });
});
