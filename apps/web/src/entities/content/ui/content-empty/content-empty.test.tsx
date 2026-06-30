import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ContentEmpty from "./content-empty";

describe("ContentEmpty", () => {
  it("빈 상태 제목을 렌더링한다", () => {
    render(<ContentEmpty />);

    expect(
      screen.getByRole("heading", {
        name: "등록된 콘텐츠가 없습니다.",
      }),
    ).toBeInTheDocument();
  });

  it("빈 상태 설명을 렌더링한다", () => {
    render(<ContentEmpty />);

    expect(screen.getByText("공개된 콘텐츠가 생기면 이곳에 표시됩니다.")).toBeInTheDocument();
  });
});
