import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Drawer, {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

describe("Admin Drawer", () => {
  it("trigger를 클릭하면 drawer를 연다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>관리자 드로어</DrawerTitle>
          <DrawerDescription>관리자 드로어 설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("관리자 드로어")).toBeInTheDocument();
    expect(screen.getByText("관리자 드로어 설명")).toBeInTheDocument();
  });

  it("close를 클릭하면 drawer를 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>관리자 드로어</DrawerTitle>
          <DrawerDescription>관리자 드로어 설명</DrawerDescription>
          <DrawerClose>닫기</DrawerClose>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "닫기" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("side 기본값은 right이고 size 기본값은 md이다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>관리자 드로어</DrawerTitle>
          <DrawerDescription>관리자 드로어 설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const drawer = screen.getByRole("dialog");

    expect(drawer).toHaveAttribute("data-side", "right");
    expect(drawer).toHaveAttribute("data-size", "md");
    expect(drawer).toHaveClass("right-0", "h-full", "border-l", "w-80", "sm:w-96");
  });

  it("side와 size를 지정할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent side="left" size="lg">
          <DrawerTitle>관리자 드로어</DrawerTitle>
          <DrawerDescription>관리자 드로어 설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const drawer = screen.getByRole("dialog");

    expect(drawer).toHaveAttribute("data-side", "left");
    expect(drawer).toHaveAttribute("data-size", "lg");
    expect(drawer).toHaveClass(
      "left-0",
      "h-full",
      "border-r",
      "w-[calc(100%-2rem)]",
      "sm:w-[32rem]",
    );
  });

  it("top side와 sm size를 지정할 수 있다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent side="top" size="sm">
          <DrawerTitle>관리자 드로어</DrawerTitle>
          <DrawerDescription>관리자 드로어 설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const drawer = screen.getByRole("dialog");

    expect(drawer).toHaveAttribute("data-side", "top");
    expect(drawer).toHaveAttribute("data-size", "sm");
    expect(drawer).toHaveClass("inset-x-0", "top-0", "border-b", "max-h-64");
  });

  it("header와 footer를 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader data-testid="header">
            <DrawerTitle>제목</DrawerTitle>
            <DrawerDescription>설명</DrawerDescription>
          </DrawerHeader>
          <div>본문</div>
          <DrawerFooter data-testid="footer">
            <DrawerClose>확인</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByTestId("header")).toHaveClass("gap-2");
    expect(screen.getByTestId("footer")).toHaveClass("pt-2");
    expect(screen.getByText("본문")).toBeInTheDocument();
  });

  it("title과 description className을 병합한다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="custom-title">제목</DrawerTitle>
          <DrawerDescription className="custom-description">설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByText("제목")).toHaveClass("tracking-tight", "custom-title");
    expect(screen.getByText("설명")).toHaveClass("leading-6", "custom-description");
  });

  it("content className을 병합한다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent className="custom-content">
          <DrawerTitle>제목</DrawerTitle>
          <DrawerDescription>설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toHaveClass("bg-surface/95", "custom-content");
  });

  it("DrawerOverlay를 Drawer context 내부에서 렌더링할 수 있다", () => {
    render(
      <Drawer open>
        <DrawerPortal>
          <DrawerOverlay data-testid="overlay" />
        </DrawerPortal>
      </Drawer>,
    );

    expect(screen.getByTestId("overlay")).toHaveClass(
      "fixed",
      "inset-0",
      "bg-overlay/55",
      "backdrop-blur-[1px]",
    );
  });

  it("접근성 속성으로 title과 description을 연결한다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>관리자 제목</DrawerTitle>
          <DrawerDescription>관리자 설명</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    const drawer = screen.getByRole("dialog");

    expect(drawer).toHaveAccessibleName("관리자 제목");
    expect(drawer).toHaveAccessibleDescription("관리자 설명");
  });
});
