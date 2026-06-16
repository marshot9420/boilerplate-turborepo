import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Tabs, { TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs", () => {
  it("defaultValue에 해당하는 탭 콘텐츠를 표시한다", () => {
    render(
      <Tabs defaultValue="account">
        <TabsList aria-label="설정 탭">
          <TabsTrigger value="account">계정</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>

        <TabsContent value="account">계정 내용</TabsContent>
        <TabsContent value="security">보안 내용</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: "계정" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByText("계정 내용")).toBeVisible();
  });

  it("탭을 클릭하면 콘텐츠를 전환한다", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="account">
        <TabsList aria-label="설정 탭">
          <TabsTrigger value="account">계정</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>

        <TabsContent value="account">계정 내용</TabsContent>
        <TabsContent value="security">보안 내용</TabsContent>
      </Tabs>,
    );

    await user.click(screen.getByRole("tab", { name: "보안" }));

    expect(screen.getByRole("tab", { name: "보안" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    expect(screen.getByText("보안 내용")).toBeVisible();
  });

  it("disabled 탭은 클릭해도 활성화되지 않는다", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="account">
        <TabsList aria-label="설정 탭">
          <TabsTrigger value="account">계정</TabsTrigger>
          <TabsTrigger value="security" disabled>
            보안
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">계정 내용</TabsContent>
        <TabsContent value="security">보안 내용</TabsContent>
      </Tabs>,
    );

    const disabledTab = screen.getByRole("tab", { name: "보안" });

    expect(disabledTab).toHaveAttribute("data-disabled", "true");

    await user.click(disabledTab);

    expect(screen.getByRole("tab", { name: "계정" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("fullWidth와 size data attribute를 렌더링한다", () => {
    render(
      <Tabs defaultValue="account">
        <TabsList aria-label="설정 탭" size="lg" fullWidth>
          <TabsTrigger value="account" size="lg" fullWidth>
            계정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">계정 내용</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole("tablist")).toHaveAttribute("data-size", "lg");
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-full-width",
      "true",
    );

    expect(screen.getByRole("tab", { name: "계정" })).toHaveAttribute(
      "data-size",
      "lg",
    );
    expect(screen.getByRole("tab", { name: "계정" })).toHaveAttribute(
      "data-full-width",
      "true",
    );
  });

  it("className을 병합한다", () => {
    render(
      <Tabs defaultValue="account">
        <TabsList aria-label="설정 탭" className="custom-list">
          <TabsTrigger value="account" className="custom-trigger">
            계정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="custom-content">
          계정 내용
        </TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole("tablist")).toHaveClass("custom-list");
    expect(screen.getByRole("tab", { name: "계정" })).toHaveClass(
      "custom-trigger",
    );
    expect(screen.getByText("계정 내용")).toHaveClass("custom-content");
  });
});
