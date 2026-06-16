import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import StatCard, {
  StatCardDescription,
  StatCardFooter,
  StatCardHeader,
  StatCardTitle,
  StatCardTrend,
  StatCardValue,
} from "./stat-card";

describe("Web StatCard", () => {
  it("stat card를 렌더링한다", () => {
    render(
      <StatCard>
        <StatCardHeader>
          <StatCardTitle>총 사용자</StatCardTitle>
          <StatCardTrend direction="up">+12%</StatCardTrend>
        </StatCardHeader>
        <StatCardValue>1,024</StatCardValue>
        <StatCardDescription>지난 30일 기준</StatCardDescription>
      </StatCard>,
    );

    expect(screen.getByText("총 사용자")).toBeInTheDocument();
    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(screen.getByText("1,024")).toBeInTheDocument();
    expect(screen.getByText("지난 30일 기준")).toBeInTheDocument();
  });

  it("web stat card 스타일을 적용한다", () => {
    render(<StatCard data-testid="stat-card" />);

    const card = screen.getByTestId("stat-card");

    expect(card).toHaveClass("rounded-2xl");
    expect(card).toHaveClass("shadow-sm");
    expect(card).toHaveAttribute("data-ds-component", "stat-card");
  });

  it("size, tone, interactive 상태를 전달한다", () => {
    render(<StatCard data-testid="stat-card" interactive size="lg" tone="success" />);

    const card = screen.getByTestId("stat-card");

    expect(card).toHaveAttribute("data-size", "lg");
    expect(card).toHaveAttribute("data-tone", "success");
    expect(card).toHaveAttribute("data-interactive", "true");
    expect(card).toHaveClass("border-success/25");
    expect(card).toHaveClass("bg-success/5");
    expect(card).toHaveClass("hover:-translate-y-0.5");
  });

  it("하위 컴포넌트에 data-ds-component를 적용한다", () => {
    render(
      <StatCard>
        <StatCardHeader data-testid="header">
          <StatCardTitle>매출</StatCardTitle>
          <StatCardTrend direction="down">-4%</StatCardTrend>
        </StatCardHeader>
        <StatCardValue>₩1,200,000</StatCardValue>
        <StatCardDescription>전월 대비</StatCardDescription>
        <StatCardFooter>최근 업데이트됨</StatCardFooter>
      </StatCard>,
    );

    expect(screen.getByTestId("header")).toHaveAttribute("data-ds-component", "stat-card-header");
    expect(screen.getByText("매출")).toHaveAttribute("data-ds-component", "stat-card-title");
    expect(screen.getByText("₩1,200,000")).toHaveAttribute("data-ds-component", "stat-card-value");
    expect(screen.getByText("전월 대비")).toHaveAttribute(
      "data-ds-component",
      "stat-card-description",
    );
    expect(screen.getByText("-4%")).toHaveAttribute("data-ds-component", "stat-card-trend");
    expect(screen.getByText("최근 업데이트됨")).toHaveAttribute(
      "data-ds-component",
      "stat-card-footer",
    );
  });

  it("trend direction 상태를 전달한다", () => {
    render(<StatCardTrend direction="down">-8%</StatCardTrend>);

    const trend = screen.getByText("-8%");

    expect(trend).toHaveAttribute("data-direction", "down");
    expect(trend).toHaveClass("bg-destructive");
  });

  it("className을 병합한다", () => {
    render(
      <StatCard className="custom-card" data-testid="stat-card">
        <StatCardTitle className="custom-title">제목</StatCardTitle>
      </StatCard>,
    );

    expect(screen.getByTestId("stat-card")).toHaveClass("custom-card");
    expect(screen.getByTestId("stat-card")).toHaveClass("rounded-2xl");
    expect(screen.getByText("제목")).toHaveClass("custom-title");
  });

  it("ref를 전달한다", () => {
    const cardRef = createRef<HTMLDivElement>();
    const headerRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const valueRef = createRef<HTMLParagraphElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    const trendRef = createRef<HTMLSpanElement>();
    const footerRef = createRef<HTMLDivElement>();

    render(
      <StatCard ref={cardRef} data-testid="stat-card">
        <StatCardHeader ref={headerRef} data-testid="header">
          <StatCardTitle ref={titleRef}>방문자</StatCardTitle>
          <StatCardTrend ref={trendRef}>0%</StatCardTrend>
        </StatCardHeader>
        <StatCardValue ref={valueRef}>320</StatCardValue>
        <StatCardDescription ref={descriptionRef}>오늘 기준</StatCardDescription>
        <StatCardFooter ref={footerRef}>실시간 집계</StatCardFooter>
      </StatCard>,
    );

    expect(cardRef.current).toBe(screen.getByTestId("stat-card"));
    expect(headerRef.current).toBe(screen.getByTestId("header"));
    expect(titleRef.current).toBe(screen.getByText("방문자"));
    expect(valueRef.current).toBe(screen.getByText("320"));
    expect(descriptionRef.current).toBe(screen.getByText("오늘 기준"));
    expect(trendRef.current).toBe(screen.getByText("0%"));
    expect(footerRef.current).toBe(screen.getByText("실시간 집계"));
  });
});
