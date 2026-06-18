import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Footer from "./footer";

describe("Web Footer", () => {
  it("푸터 랜드마크를 렌더링한다", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("현재 연도와 기본 문구를 렌더링한다", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();

    expect(screen.getByText(`© ${currentYear} Web. All rights reserved.`)).toBeInTheDocument();
    expect(screen.getByText("Powered by Turborepo Boilerplate.")).toBeInTheDocument();
  });
});
