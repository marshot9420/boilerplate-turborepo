import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Table, {
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

describe("Table", () => {
  it("table을 렌더링한다", () => {
    render(
      <Table>
        <TableCaption>사용자 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>권한</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>홍길동</TableCell>
            <TableCell>관리자</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("사용자 목록")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "이름" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "홍길동" })).toBeInTheDocument();
  });

  it("fullWidth 값을 data attribute로 렌더링한다", () => {
    render(<Table fullWidth={false} />);

    expect(screen.getByRole("table")).toHaveAttribute("data-full-width", "false");
  });

  it("selected row를 표시한다", () => {
    render(
      <Table>
        <TableBody>
          <TableRow selected>
            <TableCell>선택됨</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("row")).toHaveAttribute("data-selected", "true");
  });

  it("textAlign 값을 data attribute로 렌더링한다", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead textAlign="right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell textAlign="right">10,000원</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("columnheader", { name: "금액" })).toHaveAttribute(
      "data-text-align",
      "right",
    );

    expect(screen.getByRole("cell", { name: "10,000원" })).toHaveAttribute(
      "data-text-align",
      "right",
    );
  });

  it("empty row를 렌더링한다", () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={3}>데이터 없음</TableEmpty>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("cell", { name: "데이터 없음" })).toHaveAttribute("colspan", "3");
  });

  it("className을 병합한다", () => {
    render(
      <Table className="custom-table" containerClassName="custom-container">
        <TableBody>
          <TableRow className="custom-row">
            <TableCell className="custom-cell">셀</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("table")).toHaveClass("custom-table");
    expect(screen.getByRole("table").parentElement).toHaveClass("custom-container");
    expect(screen.getByRole("row")).toHaveClass("custom-row");
    expect(screen.getByRole("cell", { name: "셀" })).toHaveClass("custom-cell");
  });
});
