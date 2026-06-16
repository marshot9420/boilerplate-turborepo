import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StatCard, {
  StatCardDescription,
  StatCardFooter,
  StatCardHeader,
  StatCardTitle,
  StatCardTrend,
  StatCardValue,
} from "./stat-card";

describe("StatCard", () => {
  it("통계 카드 내용을 렌더링한다", () => {
    render(
      <StatCard>
        <StatCardHeader>
          <StatCardTitle>총 사용자</StatCardTitle>
          <StatCardTrend direction="up">+12%</StatCardTrend>
        </StatCardHeader>
        <StatCardValue>1,240</StatCardValue>
        <StatCardDescription>지난달 대비 증가</StatCardDescription>
      </StatCard>,
    );

    expect(screen.getByText("총 사용자")).toBeInTheDocument();
    expect(screen.getByText("1,240")).toBeInTheDocument();
    expect(screen.getByText("+12%")).toHaveAttribute("data-direction", "up");
  });

  it("size, tone, interactive을 data attribute로 렌더링한다", () => {
    render(
      <StatCard size="lg" tone="muted" interactive>
        <StatCardTitle>총 매출</StatCardTitle>
        <StatCardValue>10,000원</StatCardValue>
      </StatCard>,
    );

    const card = screen.getByText("총 매출").parentElement;

    expect(card).toHaveAttribute("data-size", "lg");
    expect(card).toHaveAttribute("data-tone", "muted");
    expect(card).toHaveAttribute("data-interactive", "true");
  });

  it("trend direction 기본값은 flat이다", () => {
    render(<StatCardTrend>0%</StatCardTrend>);

    expect(screen.getByText("0%")).toHaveAttribute("data-direction", "flat");
  });

  it("footer를 렌더링한다", () => {
    render(
      <StatCard>
        <StatCardTitle>활성 세션</StatCardTitle>
        <StatCardValue>32</StatCardValue>
        <StatCardFooter>최근 5분 기준</StatCardFooter>
      </StatCard>,
    );

    expect(screen.getByText("최근 5분 기준")).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(
      <StatCard className="custom-card">
        <StatCardHeader className="custom-header">
          <StatCardTitle className="custom-title">총 사용자</StatCardTitle>
          <StatCardTrend className="custom-trend">+12%</StatCardTrend>
        </StatCardHeader>
        <StatCardValue className="custom-value">1,240</StatCardValue>
        <StatCardDescription className="custom-description">
          설명
        </StatCardDescription>
        <StatCardFooter className="custom-footer">푸터</StatCardFooter>
      </StatCard>,
    );

    expect(screen.getByText("총 사용자").closest("[data-size]")).toHaveClass(
      "custom-card",
    );
    expect(screen.getByText("총 사용자").parentElement).toHaveClass(
      "custom-header",
    );
    expect(screen.getByText("총 사용자")).toHaveClass("custom-title");
    expect(screen.getByText("+12%")).toHaveClass("custom-trend");
    expect(screen.getByText("1,240")).toHaveClass("custom-value");
    expect(screen.getByText("설명")).toHaveClass("custom-description");
    expect(screen.getByText("푸터")).toHaveClass("custom-footer");
  });
});
