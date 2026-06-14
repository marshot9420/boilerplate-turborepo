import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Button from "./button";

describe("Web Button", () => {
  it("버튼 텍스트를 렌더링한다", () => {
    render(<Button>로그인</Button>);

    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });

  it("기본 type은 button이다", () => {
    render(<Button>로그인</Button>);

    expect(screen.getByRole("button", { name: "로그인" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("클릭 이벤트를 실행한다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>로그인</Button>);

    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서는 클릭 이벤트를 실행하지 않는다", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        로그인
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("기본 variant와 size 클래스를 적용한다", () => {
    render(<Button>로그인</Button>);

    const button = screen.getByRole("button", { name: "로그인" });

    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("text-primary-foreground");
    expect(button).toHaveClass("h-11");
  });

  it("outline variant 클래스를 적용한다", () => {
    render(<Button variant="outline">로그인</Button>);

    const button = screen.getByRole("button", { name: "로그인" });

    expect(button).toHaveClass("border");
    expect(button).toHaveClass("border-border");
    expect(button).toHaveClass("bg-background");
  });

  it("destructive variant 클래스를 적용한다", () => {
    render(<Button variant="destructive">삭제</Button>);

    const button = screen.getByRole("button", { name: "삭제" });

    expect(button).toHaveClass("bg-destructive");
    expect(button).toHaveClass("text-destructive-foreground");
  });

  it("small size 클래스를 적용한다", () => {
    render(<Button size="sm">로그인</Button>);

    const button = screen.getByRole("button", { name: "로그인" });

    expect(button).toHaveClass("h-9");
    expect(button).toHaveClass("px-3");
    expect(button).toHaveClass("text-xs");
  });

  it("large size 클래스를 적용한다", () => {
    render(<Button size="lg">로그인</Button>);

    const button = screen.getByRole("button", { name: "로그인" });

    expect(button).toHaveClass("h-13");
    expect(button).toHaveClass("px-6");
    expect(button).toHaveClass("text-base");
  });

  it("fullWidth가 true면 w-full 클래스를 적용한다", () => {
    render(<Button fullWidth>로그인</Button>);

    expect(screen.getByRole("button", { name: "로그인" })).toHaveClass(
      "w-full",
    );
  });

  it("className을 병합한다", () => {
    render(<Button className="custom-class">로그인</Button>);

    expect(screen.getByRole("button", { name: "로그인" })).toHaveClass(
      "custom-class",
    );
  });
});
