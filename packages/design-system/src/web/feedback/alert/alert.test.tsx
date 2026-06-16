import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import Alert, { AlertActions, AlertDescription, AlertTitle } from "./alert";

describe("Web Alert", () => {
  it("기본 alert를 status role로 렌더링한다", () => {
    render(<Alert>알림 메시지</Alert>);

    const alert = screen.getByRole("status");

    expect(alert).toHaveTextContent("알림 메시지");
    expect(alert).toHaveAttribute("data-tone", "default");
  });

  it("danger tone은 기본 role로 alert를 사용한다", () => {
    render(<Alert tone="danger">위험 메시지</Alert>);

    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent("위험 메시지");
    expect(alert).toHaveAttribute("data-tone", "danger");
  });

  it("role을 명시적으로 덮어쓸 수 있다", () => {
    render(
      <Alert tone="info" role="alert">
        즉시 확인 메시지
      </Alert>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("즉시 확인 메시지");
  });

  it("icon을 렌더링한다", () => {
    render(<Alert icon={<span data-testid="alert-icon">아이콘</span>}>아이콘이 있는 알림</Alert>);

    const icon = screen.getByTestId("alert-icon");

    expect(icon).toBeInTheDocument();
    expect(icon.closest("[data-slot='alert-icon']")).toHaveAttribute("aria-hidden", "true");
  });

  it("title, description, actions를 렌더링한다", () => {
    render(
      <Alert>
        <AlertTitle>알림 제목</AlertTitle>
        <AlertDescription>알림 설명</AlertDescription>
        <AlertActions>
          <button type="button">확인</button>
        </AlertActions>
      </Alert>,
    );

    expect(screen.getByText("알림 제목")).toHaveAttribute("data-slot", "alert-title");
    expect(screen.getByText("알림 설명")).toHaveAttribute("data-slot", "alert-description");
    expect(
      screen.getByRole("button", {
        name: "확인",
      }),
    ).toBeInTheDocument();
  });

  it("tone별 className을 적용한다", () => {
    render(<Alert tone="info">정보 메시지</Alert>);

    const alert = screen.getByRole("status");

    expect(alert).toHaveAttribute("data-tone", "info");
    expect(alert).toHaveClass("border-info/25");
  });

  it("className을 병합한다", () => {
    render(<Alert className="custom-alert">알림 메시지</Alert>);

    expect(screen.getByRole("status")).toHaveClass("custom-alert");
  });

  it("ref를 전달한다", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Alert ref={ref}>알림 메시지</Alert>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("하위 컴포넌트 ref를 전달한다", () => {
    const titleRef = createRef<HTMLHeadingElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    const actionsRef = createRef<HTMLDivElement>();

    render(
      <Alert>
        <AlertTitle ref={titleRef}>제목</AlertTitle>
        <AlertDescription ref={descriptionRef}>설명</AlertDescription>
        <AlertActions ref={actionsRef}>액션</AlertActions>
      </Alert>,
    );

    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
    expect(descriptionRef.current).toBeInstanceOf(HTMLParagraphElement);
    expect(actionsRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
