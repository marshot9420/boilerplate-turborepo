import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Footer from "./footer";

describe("Footer", () => {
  it("footer 영역을 렌더링한다", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("Boilerplate Turborepo")).toBeInTheDocument();
  });
});
