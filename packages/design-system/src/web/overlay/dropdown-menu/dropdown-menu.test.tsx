import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import DropdownMenu, {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

describe("Web DropdownMenu", () => {
  it("trigger를 클릭하면 menu를 연다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>내 정보</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "내 정보" })).toBeInTheDocument();
  });

  it("content 기본 size는 md이다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>내 정보</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const menu = screen.getByRole("menu");

    expect(menu).toHaveAttribute("data-size", "md");
    expect(menu).toHaveClass("min-w-44", "bg-surface", "shadow-lg");
  });

  it("content size를 지정할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent size="sm">
          <DropdownMenuItem>내 정보</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const menu = screen.getByRole("menu");

    expect(menu).toHaveAttribute("data-size", "sm");
    expect(menu).toHaveClass("min-w-36");
  });

  it("item을 클릭하면 onSelect를 호출한다", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleSelect}>설정</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));
    await user.click(screen.getByRole("menuitem", { name: "설정" }));

    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it("disabled item은 비활성 상태를 반영한다", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled onSelect={handleSelect}>
            비활성
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const item = screen.getByRole("menuitem", { name: "비활성" });

    expect(item).toHaveAttribute("data-disabled");

    await user.click(item);

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it("destructive item variant를 반영한다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive">탈퇴</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const item = screen.getByRole("menuitem", { name: "탈퇴" });

    expect(item).toHaveAttribute("data-variant", "destructive");
    expect(item).toHaveClass("text-destructive");
  });

  it("inset item을 반영한다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset>들여쓰기</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const item = screen.getByRole("menuitem", { name: "들여쓰기" });

    expect(item).toHaveAttribute("data-inset", "true");
    expect(item).toHaveClass("pl-8");
  });

  it("label과 separator를 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>계정</DropdownMenuLabel>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuItem>내 정보</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    expect(screen.getByText("계정")).toHaveClass("text-foreground");
    expect(screen.getByTestId("separator")).toHaveClass("bg-border/80");
  });

  it("checkbox item을 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>알림 받기</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const item = screen.getByRole("menuitemcheckbox", { name: "알림 받기" });

    expect(item).toHaveAttribute("data-state", "checked");
  });

  it("radio item을 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="public">
            <DropdownMenuRadioItem value="public">공개</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="private">비공개</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    expect(screen.getByRole("menuitemradio", { name: "공개" })).toHaveAttribute(
      "data-state",
      "checked",
    );
    expect(screen.getByRole("menuitemradio", { name: "비공개" })).toHaveAttribute(
      "data-state",
      "unchecked",
    );
  });

  it("className을 병합한다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem className="custom-item">내 정보</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    expect(screen.getByRole("menu")).toHaveClass("custom-content");
    expect(screen.getByRole("menuitem", { name: "내 정보" })).toHaveClass("custom-item");
  });
});
