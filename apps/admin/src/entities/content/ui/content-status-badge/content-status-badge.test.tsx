import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ContentStatusBadge from "./content-status-badge";

describe("ContentStatusBadge", () => {
  it("공개 상태 라벨을 렌더링한다", () => {
    render(<ContentStatusBadge status="PUBLISHED" />);

    expect(screen.getByText("공개")).toBeInTheDocument();
  });

  it("숨김 상태 라벨을 렌더링한다", () => {
    render(<ContentStatusBadge status="HIDDEN" />);

    expect(screen.getByText("숨김")).toBeInTheDocument();
  });

  it("삭제됨 상태 라벨을 렌더링한다", () => {
    render(<ContentStatusBadge status="DELETED" />);

    expect(screen.getByText("삭제됨")).toBeInTheDocument();
  });
});
