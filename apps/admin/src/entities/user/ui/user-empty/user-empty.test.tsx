import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import UserEmpty from "./user-empty";

describe("UserEmpty", () => {
  it("기본 빈 상태 문구를 렌더링한다", () => {
    render(<UserEmpty />);

    expect(screen.getByText("조회된 사용자가 없습니다.")).toBeInTheDocument();
    expect(
      screen.getByText("검색어나 필터 조건을 변경해서 다시 조회해 보세요."),
    ).toBeInTheDocument();
  });

  it("사용자 지정 빈 상태 문구를 렌더링한다", () => {
    render(<UserEmpty title="사용자 없음" description="다른 조건으로 검색하세요." />);

    expect(screen.getByText("사용자 없음")).toBeInTheDocument();
    expect(screen.getByText("다른 조건으로 검색하세요.")).toBeInTheDocument();
  });
});
