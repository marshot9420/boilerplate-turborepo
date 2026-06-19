import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Header from "./header";

describe("Header", () => {
  it("header 영역을 렌더링한다", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Boilerplate")).toBeInTheDocument();
  });

  it("actions가 있으면 렌더링한다", () => {
    render(<Header actions={<button type="button">로그아웃</button>} />);

    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
  });

  it("actions가 없으면 action 영역을 렌더링하지 않는다", () => {
    render(<Header />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
