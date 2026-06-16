import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DataList, {
  DataListItem,
  DataListLabel,
  DataListValue,
} from "./data-list";

describe("DataList", () => {
  it("description list를 렌더링한다", () => {
    render(
      <DataList>
        <DataListItem>
          <DataListLabel>이름</DataListLabel>
          <DataListValue>홍길동</DataListValue>
        </DataListItem>
      </DataList>,
    );

    expect(screen.getByText("이름").tagName).toBe("DT");
    expect(screen.getByText("홍길동").tagName).toBe("DD");
  });

  it("size와 divided를 data attribute로 렌더링한다", () => {
    render(
      <DataList size="lg" divided>
        <DataListItem>
          <DataListLabel>이름</DataListLabel>
          <DataListValue>홍길동</DataListValue>
        </DataListItem>
      </DataList>,
    );

    const list = screen.getByText("이름").closest("dl");

    expect(list).toHaveAttribute("data-size", "lg");
    expect(list).toHaveAttribute("data-divided", "true");
  });

  it("item orientation을 data attribute로 렌더링한다", () => {
    render(
      <DataList>
        <DataListItem orientation="horizontal">
          <DataListLabel>이름</DataListLabel>
          <DataListValue>홍길동</DataListValue>
        </DataListItem>
      </DataList>,
    );

    expect(screen.getByText("이름").parentElement).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("값이 비어 있으면 placeholder를 렌더링한다", () => {
    render(
      <DataList>
        <DataListItem>
          <DataListLabel>메모</DataListLabel>
          <DataListValue placeholder="없음">{null}</DataListValue>
        </DataListItem>
      </DataList>,
    );

    expect(screen.getByText("없음")).toHaveAttribute("data-empty", "true");
  });

  it("className을 병합한다", () => {
    render(
      <DataList className="custom-list">
        <DataListItem className="custom-item">
          <DataListLabel className="custom-label">이름</DataListLabel>
          <DataListValue className="custom-value">홍길동</DataListValue>
        </DataListItem>
      </DataList>,
    );

    expect(screen.getByText("이름").closest("dl")).toHaveClass("custom-list");
    expect(screen.getByText("이름").parentElement).toHaveClass("custom-item");
    expect(screen.getByText("이름")).toHaveClass("custom-label");
    expect(screen.getByText("홍길동")).toHaveClass("custom-value");
  });
});
