import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Tabs, { TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Web Tabs", () => {
  it("defaultValue에 해당하는 탭 콘텐츠를 표시한다", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="서비스 탭">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">개요 콘텐츠</TabsContent>
        <TabsContent value="settings">설정 콘텐츠</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: "개요" })).toHaveAttribute("data-state", "active");
    expect(screen.getByText("개요 콘텐츠")).toBeInTheDocument();
    expect(screen.queryByText("설정 콘텐츠")).not.toBeInTheDocument();
  });

  it("탭을 클릭하면 활성 콘텐츠가 변경된다", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="서비스 탭">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">개요 콘텐츠</TabsContent>
        <TabsContent value="settings">설정 콘텐츠</TabsContent>
      </Tabs>,
    );

    await user.click(screen.getByRole("tab", { name: "설정" }));

    expect(screen.getByRole("tab", { name: "설정" })).toHaveAttribute("data-state", "active");
    expect(screen.getByText("설정 콘텐츠")).toBeInTheDocument();
    expect(screen.queryByText("개요 콘텐츠")).not.toBeInTheDocument();
  });

  it("TabsList 기본 size는 md이고 fullWidth는 false이다", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="서비스 탭">
          <TabsTrigger value="overview">개요</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const list = screen.getByRole("tablist", { name: "서비스 탭" });

    expect(list).toHaveAttribute("data-size", "md");
    expect(list).toHaveAttribute("data-full-width", "false");
    expect(list).toHaveClass("bg-muted");
  });

  it("TabsList size와 fullWidth를 지정할 수 있다", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="서비스 탭" size="sm" fullWidth>
          <TabsTrigger value="overview">개요</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const list = screen.getByRole("tablist", { name: "서비스 탭" });

    expect(list).toHaveAttribute("data-size", "sm");
    expect(list).toHaveAttribute("data-full-width", "true");
    expect(list).toHaveClass("w-full");
  });

  it("TabsTrigger 기본 size는 md이고 fullWidth는 false이다", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="서비스 탭">
          <TabsTrigger value="overview">개요</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const trigger = screen.getByRole("tab", { name: "개요" });

    expect(trigger).toHaveAttribute("data-size", "md");
    expect(trigger).toHaveAttribute("data-full-width", "false");
    expect(trigger).toHaveClass("h-9", "px-3", "text-sm");
  });

  it("TabsTrigger size와 fullWidth를 지정할 수 있다", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="서비스 탭">
          <TabsTrigger value="overview" size="lg" fullWidth>
            개요
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const trigger = screen.getByRole("tab", { name: "개요" });

    expect(trigger).toHaveAttribute("data-size", "lg");
    expect(trigger).toHaveAttribute("data-full-width", "true");
    expect(trigger).toHaveClass("h-10", "px-4", "text-base", "flex-1");
  });

  it("disabled trigger는 비활성 상태를 반영한다", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="서비스 탭">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="settings" disabled>
            설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">개요 콘텐츠</TabsContent>
        <TabsContent value="settings">설정 콘텐츠</TabsContent>
      </Tabs>,
    );

    const disabledTrigger = screen.getByRole("tab", { name: "설정" });

    expect(disabledTrigger).toBeDisabled();
    expect(disabledTrigger).toHaveAttribute("data-disabled", "true");

    await user.click(disabledTrigger);

    expect(screen.getByText("개요 콘텐츠")).toBeInTheDocument();
    expect(screen.queryByText("설정 콘텐츠")).not.toBeInTheDocument();
  });

  it("TabsContent는 tabpanel로 렌더링한다", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="서비스 탭">
          <TabsTrigger value="overview">개요</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">개요 콘텐츠</TabsContent>
      </Tabs>,
    );

    const content = screen.getByRole("tabpanel");

    expect(content).toHaveTextContent("개요 콘텐츠");
    expect(content).toHaveClass("mt-4");
  });

  it("className을 병합한다", () => {
    render(
      <Tabs defaultValue="overview" className="custom-tabs">
        <TabsList aria-label="서비스 탭" className="custom-list">
          <TabsTrigger value="overview" className="custom-trigger">
            개요
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="custom-content">
          개요 콘텐츠
        </TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole("tablist", { name: "서비스 탭" })).toHaveClass("custom-list");
    expect(screen.getByRole("tab", { name: "개요" })).toHaveClass("custom-trigger");
    expect(screen.getByRole("tabpanel")).toHaveClass("custom-content");
  });
});
