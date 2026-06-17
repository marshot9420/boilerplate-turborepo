import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Alert, { AlertActions, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
  it("기본 alert를 status role로 렌더링한다", () => {
    render(
      <Alert>
        <AlertTitle>알림</AlertTitle>
        <AlertDescription>처리가 완료되었습니다.</AlertDescription>
      </Alert>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("알림")).toBeInTheDocument();
    expect(screen.getByText("처리가 완료되었습니다.")).toBeInTheDocument();
  });

  it("danger tone은 기본적으로 alert role을 사용한다", () => {
    render(
      <Alert tone="danger">
        <AlertTitle>오류</AlertTitle>
        <AlertDescription>요청 처리에 실패했습니다.</AlertDescription>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "danger");
  });

  it("role을 직접 지정할 수 있다", () => {
    render(
      <Alert tone="info" role="alert">
        <AlertTitle>주의</AlertTitle>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "info");
  });

  it("icon을 장식 요소로 렌더링한다", () => {
    render(
      <Alert icon={<span data-testid="icon">!</span>}>
        <AlertTitle>알림</AlertTitle>
      </Alert>,
    );

    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("actions를 렌더링한다", () => {
    render(
      <Alert>
        <AlertTitle>세션 만료</AlertTitle>
        <AlertDescription>다시 로그인해 주세요.</AlertDescription>
        <AlertActions>
          <button type="button">로그인</button>
        </AlertActions>
      </Alert>,
    );

    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });

  it("className을 병합한다", () => {
    render(
      <Alert className="custom-alert">
        <AlertTitle className="custom-title">알림</AlertTitle>
        <AlertDescription className="custom-description">설명</AlertDescription>
        <AlertActions className="custom-actions">액션</AlertActions>
      </Alert>,
    );

    expect(screen.getByRole("status")).toHaveClass("custom-alert");
    expect(screen.getByText("알림")).toHaveClass("custom-title");
    expect(screen.getByText("설명")).toHaveClass("custom-description");
    expect(screen.getByText("액션")).toHaveClass("custom-actions");
  });

  it("AlertTitle은 기본적으로 h5로 렌더링한다", () => {
    render(
      <Alert>
        <AlertTitle>알림 제목</AlertTitle>
      </Alert>,
    );

    const title = screen.getByText("알림 제목");

    expect(title.tagName).toBe("H5");
    expect(title).toHaveAttribute("data-title-element", "h5");
  });

  it("AlertTitle의 as prop으로 제목 태그를 변경할 수 있다", () => {
    render(
      <Alert>
        <AlertTitle as="h2">중요 알림</AlertTitle>
      </Alert>,
    );

    const title = screen.getByRole("heading", {
      level: 2,
      name: "중요 알림",
    });

    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute("data-title-element", "h2");
  });

  it("AlertTitle을 p 태그로 렌더링할 수 있다", () => {
    render(
      <Alert>
        <AlertTitle as="p">보조 알림 제목</AlertTitle>
      </Alert>,
    );

    const title = screen.getByText("보조 알림 제목");

    expect(title.tagName).toBe("P");
    expect(title).toHaveAttribute("data-title-element", "p");
  });
});
