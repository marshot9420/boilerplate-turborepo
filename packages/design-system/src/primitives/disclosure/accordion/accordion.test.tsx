import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Accordion, { AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

describe("Accordion", () => {
  it("defaultValue에 해당하는 콘텐츠를 표시한다", () => {
    render(
      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>질문 1</AccordionTrigger>
          <AccordionContent>답변 1</AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>질문 2</AccordionTrigger>
          <AccordionContent>답변 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole("button", { name: "질문 1" })).toHaveAttribute("data-state", "open");

    expect(screen.getByText("답변 1")).toBeVisible();
  });

  it("trigger를 클릭하면 콘텐츠를 연다", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>질문 1</AccordionTrigger>
          <AccordionContent>답변 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    await user.click(screen.getByRole("button", { name: "질문 1" }));

    expect(screen.getByRole("button", { name: "질문 1" })).toHaveAttribute("data-state", "open");

    expect(screen.getByText("답변 1")).toBeVisible();
  });

  it("collapsible이면 열린 trigger를 다시 클릭했을 때 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>질문 1</AccordionTrigger>
          <AccordionContent>답변 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    await user.click(screen.getByRole("button", { name: "질문 1" }));

    expect(screen.getByRole("button", { name: "질문 1" })).toHaveAttribute("data-state", "closed");
  });

  it("disabled trigger는 클릭해도 열리지 않는다", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger disabled>질문 1</AccordionTrigger>
          <AccordionContent>답변 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const disabledTrigger = screen.getByRole("button", { name: "질문 1" });

    expect(disabledTrigger).toBeDisabled();
    expect(disabledTrigger).toHaveAttribute("data-disabled", "true");

    await user.click(disabledTrigger);

    expect(disabledTrigger).toHaveAttribute("data-state", "closed");
  });

  it("rightSlot을 장식 요소로 렌더링한다", () => {
    render(
      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger rightSlot={<span data-testid="icon">⌄</span>}>질문 1</AccordionTrigger>
          <AccordionContent>답변 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("className을 병합한다", () => {
    render(
      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1" className="custom-item">
          <AccordionTrigger className="custom-trigger">질문 1</AccordionTrigger>
          <AccordionContent className="custom-content">답변 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole("button", { name: "질문 1" })).toHaveClass("custom-trigger");
    expect(screen.getByText("답변 1").parentElement).toHaveClass("custom-content");
  });
});
