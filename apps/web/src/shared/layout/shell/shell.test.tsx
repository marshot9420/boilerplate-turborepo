import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Shell from "./shell";

vi.mock("../header", () => ({
  Header: () => <header>Mock Header</header>,
}));

describe("Shell", () => {
  it("헤더, 본문, 푸터를 함께 렌더링한다", () => {
    render(
      <Shell>
        <h1>Shell 콘텐츠</h1>
      </Shell>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shell 콘텐츠" })).toBeInTheDocument();
  });

  it("children을 main 영역 안에 렌더링한다", () => {
    render(
      <Shell>
        <section aria-label="테스트 섹션">본문 내용</section>
      </Shell>,
    );

    const main = screen.getByRole("main");
    const section = screen.getByRole("region", {
      name: "테스트 섹션",
    });

    expect(main).toContainElement(section);
  });
});
