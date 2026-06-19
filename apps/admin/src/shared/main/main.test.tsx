import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Main from "./main";

describe("Main", () => {
  it("main 영역과 children을 렌더링한다", () => {
    render(
      <Main>
        <h1>본문 콘텐츠</h1>
      </Main>,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "본문 콘텐츠" })).toBeInTheDocument();
  });

  it("본문 이동 링크 대상 id를 가진다", () => {
    render(
      <Main>
        <p>내용</p>
      </Main>,
    );

    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });
});
