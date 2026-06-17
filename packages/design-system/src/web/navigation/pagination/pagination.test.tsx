import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { PaginationMeta } from "@repo/core/pagination";

import Pagination, {
  PaginationButton,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "./pagination";

function createMeta(params: Partial<PaginationMeta> = {}): PaginationMeta {
  const page = params.page ?? 2;
  const totalPages = params.totalPages ?? 5;

  return {
    page,
    limit: params.limit ?? 10,
    totalCount: params.totalCount ?? totalPages * 10,
    totalPages,
    hasNextPage: params.hasNextPage ?? page < totalPages,
    hasPreviousPage: params.hasPreviousPage ?? page > 1,
  };
}

describe("Web Pagination", () => {
  it("pagination nav를 렌더링한다", () => {
    render(<Pagination meta={createMeta()} />);

    const pagination = screen.getByRole("navigation", { name: "Pagination" });

    expect(pagination).toBeInTheDocument();
    expect(pagination).toHaveAttribute("data-disabled", "false");
    expect(pagination).toHaveClass(
      "mx-auto",
      "flex",
      "w-full",
      "justify-center",
      "text-muted-foreground",
    );
  });

  it("페이지 버튼과 현재 페이지를 렌더링한다", () => {
    render(<Pagination meta={createMeta({ page: 2, totalPages: 5 })} />);

    const currentPageButton = screen.getByRole("button", {
      name: "2 페이지로 이동",
    });

    expect(screen.getByRole("button", { name: "1 페이지로 이동" })).toBeInTheDocument();
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
    expect(currentPageButton).toHaveAttribute("data-active", "true");
  });

  it("첫 페이지에서는 이전 버튼이 disabled이다", () => {
    render(
      <Pagination
        meta={createMeta({
          page: 1,
          totalPages: 5,
          hasPreviousPage: false,
          hasNextPage: true,
        })}
      />,
    );

    expect(screen.getByRole("button", { name: "이전 페이지로 이동" })).toBeDisabled();
  });

  it("마지막 페이지에서는 다음 버튼이 disabled이다", () => {
    render(
      <Pagination
        meta={createMeta({
          page: 5,
          totalPages: 5,
          hasPreviousPage: true,
          hasNextPage: false,
        })}
      />,
    );

    expect(screen.getByRole("button", { name: "다음 페이지로 이동" })).toBeDisabled();
  });

  it("페이지 버튼을 클릭하면 onPageChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination meta={createMeta({ page: 2, totalPages: 5 })} onPageChange={handlePageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "3 페이지로 이동" }));

    expect(handlePageChange).toHaveBeenCalledTimes(1);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("이전 버튼을 클릭하면 이전 페이지로 onPageChange를 호출한다", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination meta={createMeta({ page: 3, totalPages: 5 })} onPageChange={handlePageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "이전 페이지로 이동" }));

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("disabled이면 페이지 변경을 호출하지 않는다", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination
        meta={createMeta({ page: 2, totalPages: 5 })}
        disabled
        onPageChange={handlePageChange}
      />,
    );

    const pagination = screen.getByRole("navigation", { name: "Pagination" });
    const pageButton = screen.getByRole("button", { name: "3 페이지로 이동" });

    expect(pagination).toHaveAttribute("data-disabled", "true");
    expect(pageButton).toBeDisabled();

    await user.click(pageButton);

    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it("getHref가 있으면 link로 렌더링한다", () => {
    render(
      <Pagination
        meta={createMeta({ page: 2, totalPages: 5 })}
        getHref={(page) => `/contents?page=${page}`}
      />,
    );

    const link = screen.getByRole("link", { name: "3 페이지로 이동" });

    expect(link).toHaveAttribute("href", "/contents?page=3");
  });

  it("link 모드의 현재 페이지는 aria-current를 가진다", () => {
    render(
      <Pagination
        meta={createMeta({ page: 2, totalPages: 5 })}
        getHref={(page) => `/contents?page=${page}`}
      />,
    );

    const currentPageLink = screen.getByRole("link", {
      name: "2 페이지로 이동",
    });

    expect(currentPageLink).toHaveAttribute("aria-current", "page");
    expect(currentPageLink).toHaveAttribute("data-active", "true");
  });

  it("renderPageLabel을 사용할 수 있다", () => {
    render(
      <Pagination
        meta={createMeta({ page: 2, totalPages: 3 })}
        renderPageLabel={(page) => `P${page}`}
      />,
    );

    expect(screen.getByRole("button", { name: "1 페이지로 이동" })).toHaveTextContent("P1");
    expect(screen.getByRole("button", { name: "2 페이지로 이동" })).toHaveTextContent("P2");
  });

  it("previousLabel과 nextLabel을 지정할 수 있다", () => {
    render(
      <Pagination
        meta={createMeta({ page: 2, totalPages: 5 })}
        previousLabel="Prev"
        nextLabel="Next"
      />,
    );

    expect(screen.getByRole("button", { name: "이전 페이지로 이동" })).toHaveTextContent("Prev");
    expect(screen.getByRole("button", { name: "다음 페이지로 이동" })).toHaveTextContent("Next");
  });

  it("페이지가 많으면 ellipsis를 렌더링한다", () => {
    render(<Pagination meta={createMeta({ page: 10, totalPages: 20 })} />);

    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("하위 컴포넌트를 직접 조합할 수 있다", () => {
    render(
      <PaginationList data-testid="list">
        <PaginationItem data-testid="item">
          <PaginationButton active>1</PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/contents?page=2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis data-testid="ellipsis" />
        </PaginationItem>
      </PaginationList>,
    );

    expect(screen.getByTestId("list").tagName).toBe("UL");
    expect(screen.getByTestId("item").tagName).toBe("LI");
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("href", "/contents?page=2");
    expect(screen.getByTestId("ellipsis")).toHaveTextContent("…");
  });

  it("className을 병합한다", () => {
    render(
      <Pagination meta={createMeta()} className="custom-pagination" data-testid="pagination" />,
    );

    expect(screen.getByTestId("pagination")).toHaveClass(
      "text-muted-foreground",
      "custom-pagination",
    );
  });
});
