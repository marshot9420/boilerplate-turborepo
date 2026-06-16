import { render, screen } from "@testing-library/react";

import { createRef } from "react";

import Table, {
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

describe("Web Table", () => {
  it("table을 렌더링한다", () => {
    render(
      <Table>
        <TableCaption>사용자 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>MARSHOT</TableCell>
            <TableCell>활성</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const table = screen.getByRole("table", {
      name: "사용자 목록",
    });

    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute("data-ds-component", "table");
    expect(screen.getByText("MARSHOT")).toBeInTheDocument();
  });

  it("web table container 스타일을 적용한다", () => {
    const { container } = render(<Table aria-label="빈 표" />);

    const tableContainer = container.querySelector('[data-slot="table-container"]');

    expect(tableContainer).toHaveClass("rounded-2xl");
    expect(tableContainer).toHaveClass("border");
    expect(tableContainer).toHaveClass("bg-surface");
    expect(tableContainer).toHaveClass("shadow-sm");
  });

  it("containerClassName과 className을 병합한다", () => {
    const { container } = render(
      <Table
        aria-label="사용자 목록"
        className="custom-table"
        containerClassName="custom-container"
      />,
    );

    const table = screen.getByRole("table", {
      name: "사용자 목록",
    });
    const tableContainer = container.querySelector('[data-slot="table-container"]');

    expect(table).toHaveClass("custom-table");
    expect(table).toHaveClass("min-w-full");
    expect(tableContainer).toHaveClass("custom-container");
    expect(tableContainer).toHaveClass("rounded-2xl");
  });

  it("fullWidth 상태를 전달한다", () => {
    render(<Table aria-label="사용자 목록" fullWidth={false} />);

    const table = screen.getByRole("table", {
      name: "사용자 목록",
    });

    expect(table).toHaveAttribute("data-full-width", "false");
    expect(table).toHaveClass("w-auto");
  });

  it("header, body, footer에 data-ds-component를 적용한다", () => {
    render(
      <Table aria-label="요약 표">
        <TableHeader data-testid="header" />
        <TableBody data-testid="body" />
        <TableFooter data-testid="footer" />
      </Table>,
    );

    expect(screen.getByTestId("header")).toHaveAttribute("data-ds-component", "table-header");
    expect(screen.getByTestId("body")).toHaveAttribute("data-ds-component", "table-body");
    expect(screen.getByTestId("footer")).toHaveAttribute("data-ds-component", "table-footer");
  });

  it("row selected 상태를 전달한다", () => {
    render(
      <Table aria-label="사용자 목록">
        <TableBody>
          <TableRow selected>
            <TableCell>선택됨</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("row")).toHaveAttribute("data-selected", "true");
  });

  it("head와 cell의 textAlign 상태를 전달한다", () => {
    render(
      <Table aria-label="정렬 표">
        <TableHeader>
          <TableRow>
            <TableHead textAlign="right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell textAlign="right">100,000</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("columnheader", { name: "금액" })).toHaveAttribute(
      "data-text-align",
      "right",
    );
    expect(screen.getByRole("cell", { name: "100,000" })).toHaveAttribute(
      "data-text-align",
      "right",
    );
  });

  it("empty 상태를 렌더링한다", () => {
    render(
      <Table aria-label="빈 표">
        <TableBody>
          <TableEmpty colSpan={2}>비어 있음</TableEmpty>
        </TableBody>
      </Table>,
    );

    const empty = screen.getByText("비어 있음");

    expect(empty).toHaveAttribute("colspan", "2");
    expect(empty).toHaveAttribute("data-ds-component", "table-empty");
  });

  it("ref를 전달한다", () => {
    const tableRef = createRef<HTMLTableElement>();
    const headerRef = createRef<HTMLTableSectionElement>();
    const bodyRef = createRef<HTMLTableSectionElement>();
    const footerRef = createRef<HTMLTableSectionElement>();
    const rowRef = createRef<HTMLTableRowElement>();
    const headRef = createRef<HTMLTableCellElement>();
    const cellRef = createRef<HTMLTableCellElement>();
    const captionRef = createRef<HTMLTableCaptionElement>();
    const emptyRef = createRef<HTMLTableCellElement>();

    render(
      <Table ref={tableRef}>
        <TableCaption ref={captionRef}>사용자 목록</TableCaption>
        <TableHeader ref={headerRef}>
          <TableRow>
            <TableHead ref={headRef}>이름</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref={bodyRef}>
          <TableRow ref={rowRef} data-testid="row">
            <TableCell ref={cellRef}>MARSHOT</TableCell>
          </TableRow>
          <TableEmpty ref={emptyRef} colSpan={1}>
            없음
          </TableEmpty>
        </TableBody>
        <TableFooter ref={footerRef} data-testid="footer" />
      </Table>,
    );

    expect(tableRef.current).toBe(
      screen.getByRole("table", {
        name: "사용자 목록",
      }),
    );
    expect(captionRef.current).toBe(screen.getByText("사용자 목록"));
    expect(headerRef.current).toBe(screen.getByTestId("header"));
    expect(rowRef.current).toBe(screen.getByTestId("row"));
    expect(headRef.current).toBe(screen.getByRole("columnheader", { name: "이름" }));
    expect(cellRef.current).toBe(screen.getByRole("cell", { name: "MARSHOT" }));
    expect(emptyRef.current).toBe(screen.getByRole("cell", { name: "없음" }));
    expect(bodyRef.current).toBe(screen.getAllByRole("rowgroup")[1]);
    expect(footerRef.current).toBe(screen.getByTestId("footer"));
  });
});
