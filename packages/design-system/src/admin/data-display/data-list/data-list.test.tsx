import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import DataList, { DataListItem, DataListLabel, DataListValue } from "./data-list";

describe("Admin DataList", () => {
  it("data list를 렌더링한다", () => {
    const { container } = render(
      <DataList>
        <DataListItem>
          <DataListLabel>이름</DataListLabel>
          <DataListValue>MARSHOT</DataListValue>
        </DataListItem>
      </DataList>,
    );

    const list = container.querySelector("dl");

    expect(list).toBeInTheDocument();
    expect(list).toHaveAttribute("data-ds-component", "data-list");
    expect(screen.getByText("이름")).toBeInTheDocument();
    expect(screen.getByText("MARSHOT")).toBeInTheDocument();
  });

  it("admin data list 스타일을 적용한다", () => {
    const { container } = render(<DataList />);

    const list = container.querySelector("dl");

    expect(list).toHaveClass("rounded-lg");
    expect(list).toHaveClass("border");
    expect(list).toHaveClass("bg-surface");
    expect(list).toHaveClass("shadow-none");
  });

  it("size와 divided 상태를 전달한다", () => {
    const { container } = render(<DataList divided size="lg" />);

    const list = container.querySelector("dl");

    expect(list).toHaveAttribute("data-size", "lg");
    expect(list).toHaveAttribute("data-divided", "true");
    expect(list).toHaveClass("p-5");
  });

  it("item orientation 상태를 전달한다", () => {
    render(<DataListItem orientation="horizontal">내용</DataListItem>);

    expect(screen.getByText("내용")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("label과 value에 admin 스타일을 적용한다", () => {
    render(
      <DataList>
        <DataListItem>
          <DataListLabel>상태</DataListLabel>
          <DataListValue>활성</DataListValue>
        </DataListItem>
      </DataList>,
    );

    expect(screen.getByText("상태")).toHaveClass("text-xs");
    expect(screen.getByText("상태")).toHaveClass("uppercase");
    expect(screen.getByText("활성")).toHaveClass("font-medium");
  });

  it("value가 비어 있으면 placeholder를 렌더링한다", () => {
    render(<DataListValue />);

    const value = screen.getByText("—");

    expect(value).toBeInTheDocument();
    expect(value).toHaveAttribute("data-empty", "true");
  });

  it("value placeholder를 변경할 수 있다", () => {
    render(<DataListValue placeholder="없음" />);

    expect(screen.getByText("없음")).toHaveAttribute("data-empty", "true");
  });

  it("className을 병합한다", () => {
    const { container } = render(<DataList className="custom-list" />);

    const list = container.querySelector("dl");

    expect(list).toHaveClass("custom-list");
    expect(list).toHaveClass("rounded-lg");
  });

  it("ref를 전달한다", () => {
    const listRef = createRef<HTMLDListElement>();
    const itemRef = createRef<HTMLDivElement>();
    const labelRef = createRef<HTMLElement>();
    const valueRef = createRef<HTMLElement>();

    const { container } = render(
      <DataList ref={listRef}>
        <DataListItem ref={itemRef}>
          <DataListLabel ref={labelRef}>이름</DataListLabel>
          <DataListValue ref={valueRef}>MARSHOT</DataListValue>
        </DataListItem>
      </DataList>,
    );

    expect(listRef.current).toBe(container.querySelector("dl"));
    expect(itemRef.current).toBe(screen.getByText("이름").parentElement);
    expect(labelRef.current).toBe(screen.getByText("이름"));
    expect(valueRef.current).toBe(screen.getByText("MARSHOT"));
  });
});
