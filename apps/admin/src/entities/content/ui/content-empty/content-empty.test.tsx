import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ContentEmpty from "./content-empty";

describe("ContentEmpty", () => {
  it("콘텐츠가 없을 때 기본 empty state를 렌더링한다", () => {
    render(<ContentEmpty />);

    expect(screen.getByText("등록된 콘텐츠가 없습니다.")).toBeInTheDocument();
    expect(screen.getByText("콘텐츠가 생성되면 이곳에서 관리할 수 있습니다.")).toBeInTheDocument();
  });

  it("필터 결과가 없을 때 filtered empty state를 렌더링한다", () => {
    render(<ContentEmpty filtered />);

    expect(screen.getByText("조건에 맞는 콘텐츠가 없습니다.")).toBeInTheDocument();
    expect(screen.getByText("검색 조건을 변경한 뒤 다시 확인해 주세요.")).toBeInTheDocument();
  });
});
