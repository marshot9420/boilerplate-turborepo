import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { PaginationMeta } from "@repo/core/pagination";

import Pagination, { PaginationButton, getPaginationItems } from "./pagination";

describe("Pagination", () => {
  const meta = {
    page: 2,
    limit: 20,
    totalCount: 80,
    totalPages: 4,
    hasNextPage: true,
    hasPreviousPage: true,
  } satisfies PaginationMeta;

  it("페이지네이션을 렌더링한다", () => {
    render(<Pagination meta={meta} onPageChange={vi.fn()} />);

    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "2 페이지로 이동" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("페이지 버튼을 클릭하면 onPageChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(<Pagination meta={meta} onPageChange={handlePageChange} />);

    await user.click(screen.getByRole("button", { name: "3 페이지로 이동" }));

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("이전 페이지가 없으면 이전 버튼을 비활성화한다", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination
        meta={{
          page: 1,
          limit: 20,
          totalCount: 40,
          totalPages: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        }}
        onPageChange={handlePageChange}
      />,
    );

    const previousButton = screen.getByRole("button", {
      name: "이전 페이지로 이동",
    });

    expect(previousButton).toBeDisabled();

    await user.click(previousButton);

    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it("다음 페이지가 없으면 다음 버튼을 비활성화한다", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination
        meta={{
          page: 2,
          limit: 20,
          totalCount: 40,
          totalPages: 2,
          hasNextPage: false,
          hasPreviousPage: true,
        }}
        onPageChange={handlePageChange}
      />,
    );

    const nextButton = screen.getByRole("button", {
      name: "다음 페이지로 이동",
    });

    expect(nextButton).toBeDisabled();

    await user.click(nextButton);

    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it("getHref가 있으면 링크 기반 페이지네이션을 렌더링한다", () => {
    render(
      <Pagination meta={meta} getHref={(page) => `/contents?page=${page}&limit=${meta.limit}`} />,
    );

    expect(screen.getByRole("link", { name: "3 페이지로 이동" })).toHaveAttribute(
      "href",
      "/contents?page=3&limit=20",
    );
  });

  it("PaginationButton의 기본 type은 button이다", () => {
    render(<PaginationButton>페이지</PaginationButton>);

    expect(screen.getByRole("button", { name: "페이지" })).toHaveAttribute("type", "button");
  });

  it("getPaginationItems는 전체 페이지가 적으면 모든 페이지를 반환한다", () => {
    expect(
      getPaginationItems({
        currentPage: 1,
        totalPages: 5,
      }),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  it("getPaginationItems는 중간 페이지에서 양쪽 ellipsis를 반환한다", () => {
    expect(
      getPaginationItems({
        currentPage: 5,
        totalPages: 10,
      }),
    ).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });

  it("getPaginationItems는 시작 구간에서 오른쪽 ellipsis만 반환한다", () => {
    expect(
      getPaginationItems({
        currentPage: 1,
        totalPages: 10,
      }),
    ).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
  });

  it("getPaginationItems는 끝 구간에서 왼쪽 ellipsis만 반환한다", () => {
    expect(
      getPaginationItems({
        currentPage: 10,
        totalPages: 10,
      }),
    ).toEqual([1, "ellipsis", 6, 7, 8, 9, 10]);
  });
});
