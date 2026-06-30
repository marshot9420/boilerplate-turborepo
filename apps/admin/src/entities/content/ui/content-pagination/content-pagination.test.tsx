import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { PaginationMeta } from "@repo/core/pagination";

import { URLS } from "@/constants";

import ContentPagination from "./content-pagination";

describe("ContentPagination", () => {
  const meta: PaginationMeta = {
    page: 2,
    limit: 20,
    totalCount: 60,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: true,
  };

  it("페이지가 1개 이하이면 렌더링하지 않는다", () => {
    const { container } = render(
      <ContentPagination
        meta={{
          page: 1,
          limit: 20,
          totalCount: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        }}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("페이지네이션 링크를 렌더링한다", () => {
    render(<ContentPagination meta={meta} />);

    expect(
      screen.getByRole("navigation", { name: "콘텐츠 목록 페이지네이션" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "이전 페이지로 이동" })).toHaveAttribute(
      "href",
      `${URLS.CLIENT.CONTENTS}?page=1`,
    );

    expect(screen.getByRole("link", { name: "1 페이지로 이동" })).toHaveAttribute(
      "href",
      `${URLS.CLIENT.CONTENTS}?page=1`,
    );

    expect(screen.getByRole("link", { name: "2 페이지로 이동" })).toHaveAttribute(
      "href",
      `${URLS.CLIENT.CONTENTS}?page=2`,
    );

    expect(screen.getByRole("link", { name: "3 페이지로 이동" })).toHaveAttribute(
      "href",
      `${URLS.CLIENT.CONTENTS}?page=3`,
    );

    expect(screen.getByRole("link", { name: "다음 페이지로 이동" })).toHaveAttribute(
      "href",
      `${URLS.CLIENT.CONTENTS}?page=3`,
    );
  });

  it("기존 검색 조건을 유지하고 page만 갱신한다", () => {
    render(
      <ContentPagination
        meta={meta}
        searchParams={{
          page: "99",
          status: "HIDDEN",
          authorId: "",
          limit: "10",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "3 페이지로 이동" })).toHaveAttribute(
      "href",
      `${URLS.CLIENT.CONTENTS}?status=HIDDEN&limit=10&page=3`,
    );
  });
});
