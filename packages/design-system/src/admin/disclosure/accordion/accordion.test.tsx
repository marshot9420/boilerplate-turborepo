import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createRef } from "react";

import Accordion, { AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

describe("Admin Accordion", () => {
  it("accordion을 렌더링한다", () => {
    render(
      <Accordion collapsible defaultValue="profile" type="single">
        <AccordionItem value="profile">
          <AccordionTrigger>프로필</AccordionTrigger>
          <AccordionContent>프로필 내용</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole("button", { name: "프로필" })).toBeInTheDocument();
    expect(screen.getByText("프로필 내용")).toBeInTheDocument();
  });

  it("admin accordion 스타일을 적용한다", () => {
    render(
      <Accordion collapsible data-testid="accordion" type="single">
        <AccordionItem value="profile">
          <AccordionTrigger>프로필</AccordionTrigger>
          <AccordionContent>프로필 내용</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const accordion = screen.getByTestId("accordion");

    expect(accordion).toHaveClass("rounded-lg");
    expect(accordion).toHaveClass("border");
    expect(accordion).toHaveClass("bg-surface");
    expect(accordion).toHaveClass("shadow-none");
    expect(accordion).toHaveAttribute("data-ds-component", "accordion");
  });

  it("item, trigger, content에 data-ds-component를 적용한다", () => {
    render(
      <Accordion collapsible type="single">
        <AccordionItem data-testid="item" value="profile">
          <AccordionTrigger>프로필</AccordionTrigger>
          <AccordionContent data-testid="content">프로필 내용</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByTestId("item")).toHaveAttribute("data-ds-component", "accordion-item");
    expect(screen.getByRole("button", { name: "프로필" })).toHaveAttribute(
      "data-ds-component",
      "accordion-trigger",
    );
    expect(screen.getByTestId("content")).toHaveAttribute("data-ds-component", "accordion-content");
  });

  it("trigger에 admin 스타일을 적용한다", () => {
    render(
      <Accordion collapsible type="single">
        <AccordionItem value="profile">
          <AccordionTrigger>프로필</AccordionTrigger>
          <AccordionContent>프로필 내용</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole("button", { name: "프로필" });

    expect(trigger).toHaveClass("py-3.5");
    expect(trigger).toHaveClass("text-sm");
    expect(trigger).toHaveClass("font-semibold");
  });

  it("defaultValue로 열린 item을 지정할 수 있다", () => {
    render(
      <Accordion collapsible defaultValue="profile" type="single">
        <AccordionItem value="profile">
          <AccordionTrigger>프로필</AccordionTrigger>
          <AccordionContent>프로필 내용</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole("button", { name: "프로필" })).toHaveAttribute("data-state", "open");
  });

  it("trigger를 클릭하면 item을 열고 닫는다", async () => {
    const user = userEvent.setup();

    render(
      <Accordion collapsible type="single">
        <AccordionItem value="profile">
          <AccordionTrigger>프로필</AccordionTrigger>
          <AccordionContent>프로필 내용</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole("button", { name: "프로필" });

    expect(trigger).toHaveAttribute("data-state", "closed");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("data-state", "open");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  it("rightSlot을 렌더링한다", () => {
    render(
      <Accordion collapsible type="single">
        <AccordionItem value="profile">
          <AccordionTrigger rightSlot={<span data-testid="right-slot">⌄</span>}>
            프로필
          </AccordionTrigger>
          <AccordionContent>프로필 내용</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByTestId("right-slot")).toBeInTheDocument();
  });

  it("disabled trigger를 렌더링한다", async () => {
    const user = userEvent.setup();

    render(
      <Accordion collapsible type="single">
        <AccordionItem value="profile">
          <AccordionTrigger disabled>프로필</AccordionTrigger>
          <AccordionContent>프로필 내용</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole("button", { name: "프로필" });

    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute("data-disabled", "true");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  it("className을 병합한다", () => {
    render(
      <Accordion className="custom-accordion" collapsible data-testid="accordion" type="single">
        <AccordionItem className="custom-item" data-testid="item" value="profile">
          <AccordionTrigger className="custom-trigger">프로필</AccordionTrigger>
          <AccordionContent className="custom-content" data-testid="content">
            프로필 내용
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByTestId("accordion")).toHaveClass("custom-accordion");
    expect(screen.getByTestId("accordion")).toHaveClass("rounded-lg");
    expect(screen.getByTestId("item")).toHaveClass("custom-item");
    expect(screen.getByRole("button", { name: "프로필" })).toHaveClass("custom-trigger");
    expect(screen.getByTestId("content")).toHaveClass("custom-content");
  });

  it("ref를 전달한다", () => {
    const accordionRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Accordion
        ref={accordionRef}
        collapsible
        data-testid="accordion"
        defaultValue="profile"
        type="single"
      >
        <AccordionItem ref={itemRef} data-testid="item" value="profile">
          <AccordionTrigger ref={triggerRef}>프로필</AccordionTrigger>
          <AccordionContent ref={contentRef} data-testid="content">
            프로필 내용
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(accordionRef.current).toBe(screen.getByTestId("accordion"));
    expect(itemRef.current).toBe(screen.getByTestId("item"));
    expect(triggerRef.current).toBe(screen.getByRole("button", { name: "프로필" }));
    expect(contentRef.current).toBe(screen.getByTestId("content"));
  });
});
