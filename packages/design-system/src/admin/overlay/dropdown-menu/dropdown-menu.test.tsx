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

describe("Admin DropdownMenu", () => {
  it("trigger를 클릭하면 menu를 연다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>대시보드</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "대시보드" })).toBeInTheDocument();
  });

  it("content 기본 size는 md이다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>대시보드</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const menu = screen.getByRole("menu");

    expect(menu).toHaveAttribute("data-size", "md");
    expect(menu).toHaveClass("min-w-44", "bg-surface/95", "shadow-lg");
  });

  it("content size를 지정할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent size="lg">
          <DropdownMenuItem>대시보드</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const menu = screen.getByRole("menu");

    expect(menu).toHaveAttribute("data-size", "lg");
    expect(menu).toHaveClass("min-w-56");
  });

  it("item을 클릭하면 onSelect를 호출한다", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleSelect}>수정</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));
    await user.click(screen.getByRole("menuitem", { name: "수정" }));

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
          <DropdownMenuItem variant="destructive">삭제</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const item = screen.getByRole("menuitem", { name: "삭제" });

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
          <DropdownMenuLabel>관리</DropdownMenuLabel>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuItem>대시보드</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    expect(screen.getByText("관리")).toHaveClass("text-foreground");
    expect(screen.getByTestId("separator")).toHaveClass("bg-border/80");
  });

  it("checkbox item을 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>활성화</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const item = screen.getByRole("menuitemcheckbox", { name: "활성화" });

    expect(item).toHaveAttribute("data-state", "checked");
  });

  it("radio item을 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="published">
            <DropdownMenuRadioItem value="published">게시</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="hidden">숨김</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    expect(screen.getByRole("menuitemradio", { name: "게시" })).toHaveAttribute(
      "data-state",
      "checked",
    );
    expect(screen.getByRole("menuitemradio", { name: "숨김" })).toHaveAttribute(
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
          <DropdownMenuItem className="custom-item">대시보드</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    expect(screen.getByRole("menu")).toHaveClass("custom-content");
    expect(screen.getByRole("menuitem", { name: "대시보드" })).toHaveClass("custom-item");
  });
});
