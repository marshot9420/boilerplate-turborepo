import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Main from "./main";

describe("Web Main", () => {
  it("main 랜드마크를 렌더링한다", () => {
    render(
      <Main>
        <h1>페이지 제목</h1>
      </Main>,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("children을 렌더링한다", () => {
    render(
      <Main>
        <section>
          <h1>콘텐츠 영역</h1>
          <p>본문입니다.</p>
        </section>
      </Main>,
    );

    expect(screen.getByRole("heading", { name: "콘텐츠 영역" })).toBeInTheDocument();
    expect(screen.getByText("본문입니다.")).toBeInTheDocument();
  });
});
