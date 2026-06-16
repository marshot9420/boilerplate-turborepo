import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

describe("Drawer", () => {
  it("trigger를 클릭하면 drawer를 연다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>메뉴</DrawerTitle>
          <DrawerDescription>사이드 메뉴입니다.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("메뉴")).toBeInTheDocument();
    expect(screen.getByText("사이드 메뉴입니다.")).toBeInTheDocument();
  });

  it("close를 클릭하면 drawer를 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>메뉴</DrawerTitle>
          <DrawerDescription>사이드 메뉴입니다.</DrawerDescription>
          <DrawerClose>닫기</DrawerClose>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Escape를 누르면 drawer를 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>열기</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>메뉴</DrawerTitle>
          <DrawerDescription>사이드 메뉴입니다.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "열기" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("defaultOpen이면 처음부터 drawer를 렌더링한다", () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>열린 Drawer</DrawerTitle>
          <DrawerDescription>처음부터 열린 상태입니다.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("열린 Drawer")).toBeInTheDocument();
  });

  it("side와 size를 data attribute로 노출한다", () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent side="left" size="lg">
          <DrawerTitle>왼쪽 Drawer</DrawerTitle>
          <DrawerDescription>왼쪽에서 열립니다.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    const drawer = screen.getByRole("dialog");

    expect(drawer).toHaveAttribute("data-side", "left");
    expect(drawer).toHaveAttribute("data-size", "lg");
  });

  it("기본 side는 right이고 size는 md다", () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>기본 Drawer</DrawerTitle>
          <DrawerDescription>기본 상태입니다.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    const drawer = screen.getByRole("dialog");

    expect(drawer).toHaveAttribute("data-side", "right");
    expect(drawer).toHaveAttribute("data-size", "md");
  });

  it("className을 병합한다", () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent className="custom-drawer-content">
          <DrawerTitle>커스텀 Drawer</DrawerTitle>
          <DrawerDescription>커스텀 클래스입니다.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toHaveClass("custom-drawer-content");
  });

  it("header와 footer를 렌더링한다", () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerHeader data-testid="drawer-header">
            <DrawerTitle>제목</DrawerTitle>
            <DrawerDescription>설명</DrawerDescription>
          </DrawerHeader>

          <DrawerFooter data-testid="drawer-footer">
            <button type="button">확인</button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByTestId("drawer-header")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-footer")).toBeInTheDocument();
  });

  it("DrawerContent ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Drawer defaultOpen>
        <DrawerContent ref={ref}>
          <DrawerTitle>Ref Drawer</DrawerTitle>
          <DrawerDescription>ref 테스트입니다.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
