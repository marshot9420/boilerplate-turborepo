import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createRef } from "react";

import FieldDescription from "./field-description";

describe("FieldDescription", () => {
  it("children을 렌더링한다", () => {
    render(<FieldDescription>이메일은 로그인에 사용됩니다.</FieldDescription>);

    expect(
      screen.getByText("이메일은 로그인에 사용됩니다."),
    ).toBeInTheDocument();
  });

  it("id를 p element에 전달한다", () => {
    render(
      <FieldDescription id="email-description">
        이메일은 로그인에 사용됩니다.
      </FieldDescription>,
    );

    expect(screen.getByText("이메일은 로그인에 사용됩니다.")).toHaveAttribute(
      "id",
      "email-description",
    );
  });

  it("disabled 상태를 data attribute로 노출한다", () => {
    render(<FieldDescription disabled>비활성 설명</FieldDescription>);

    expect(screen.getByText("비활성 설명")).toHaveAttribute(
      "data-disabled",
      "true",
    );
  });

  it("className을 병합한다", () => {
    render(
      <FieldDescription className="custom-description">설명</FieldDescription>,
    );

    expect(screen.getByText("설명")).toHaveClass("custom-description");
  });

  it("ref를 p element로 전달한다", () => {
    const ref = createRef<HTMLParagraphElement>();

    render(<FieldDescription ref={ref}>설명</FieldDescription>);

    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});
