import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Button from "./button";

describe("Admin Button", () => {
  it("버튼 텍스트를 렌더링한다", () => {
    render(<Button>저장</Button>);

    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });

  it("기본 type은 button이다", () => {
    render(<Button>저장</Button>);

    expect(screen.getByRole("button", { name: "저장" })).toHaveAttribute("type", "button");
  });

  it("클릭 이벤트를 실행한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>저장</Button>);

    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서는 클릭 이벤트를 실행하지 않는다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        저장
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("기본 variant와 size 클래스를 적용한다", () => {
    render(<Button>저장</Button>);

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).toHaveClass("border-primary");
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("text-primary-foreground");
    expect(button).toHaveClass("h-9");
  });

  it("secondary variant 클래스를 적용한다", () => {
    render(<Button variant="secondary">저장</Button>);

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).toHaveClass("border-border");
    expect(button).toHaveClass("bg-muted");
    expect(button).toHaveClass("text-foreground");
  });

  it("outline variant 클래스를 적용한다", () => {
    render(<Button variant="outline">저장</Button>);

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).toHaveClass("border-border");
    expect(button).toHaveClass("bg-background");
  });

  it("ghost variant 클래스를 적용한다", () => {
    render(<Button variant="ghost">저장</Button>);

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).toHaveClass("border-transparent");
    expect(button).toHaveClass("bg-transparent");
  });

  it("destructive variant 클래스를 적용한다", () => {
    render(<Button variant="destructive">삭제</Button>);

    const button = screen.getByRole("button", { name: "삭제" });

    expect(button).toHaveClass("border-destructive");
    expect(button).toHaveClass("bg-destructive");
    expect(button).toHaveClass("text-destructive-foreground");
  });

  it("small size 클래스를 적용한다", () => {
    render(<Button size="sm">저장</Button>);

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).toHaveClass("h-8");
    expect(button).toHaveClass("px-3");
    expect(button).toHaveClass("text-xs");
  });

  it("large size 클래스를 적용한다", () => {
    render(<Button size="lg">저장</Button>);

    const button = screen.getByRole("button", { name: "저장" });

    expect(button).toHaveClass("h-10");
    expect(button).toHaveClass("px-5");
    expect(button).toHaveClass("text-sm");
  });

  it("fullWidth가 true면 w-full 클래스를 적용한다", () => {
    render(<Button fullWidth>저장</Button>);

    expect(screen.getByRole("button", { name: "저장" })).toHaveClass("w-full");
  });

  it("className을 병합한다", () => {
    render(<Button className="custom-class">저장</Button>);

    expect(screen.getByRole("button", { name: "저장" })).toHaveClass("custom-class");
  });
});
