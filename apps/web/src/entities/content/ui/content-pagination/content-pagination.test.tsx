import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentListResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

import ContentPagination from "./content-pagination";

const baseMeta = {
  page: 1,
  limit: 20,
  totalCount: 60,
  totalPages: 3,
  hasNextPage: true,
  hasPreviousPage: false,
} satisfies ContentListResponse["meta"];

describe("ContentPagination", () => {
  it("전체 페이지가 1 이하이면 렌더링하지 않는다", () => {
    const { container } = render(
      <ContentPagination
        meta={{
          ...baseMeta,
          totalCount: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        }}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("페이지네이션 내비게이션을 렌더링한다", () => {
    render(<ContentPagination meta={baseMeta} />);

    expect(
      screen.getByRole("navigation", {
        name: "콘텐츠 페이지네이션",
      }),
    ).toBeInTheDocument();
  });

  it("다음 페이지 링크를 생성한다", () => {
    render(<ContentPagination meta={baseMeta} />);

    expect(
      screen.getByRole("link", {
        name: "다음 페이지로 이동",
      }),
    ).toHaveAttribute("href", `${URLS.CLIENT.CONTENTS}?page=2`);
  });

  it("이전 페이지 링크를 생성한다", () => {
    render(
      <ContentPagination
        meta={{
          ...baseMeta,
          page: 2,
          hasNextPage: true,
          hasPreviousPage: true,
        }}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: "이전 페이지로 이동",
      }),
    ).toHaveAttribute("href", URLS.CLIENT.CONTENTS);
  });

  it("기본 limit이 아니면 limit query를 유지한다", () => {
    render(
      <ContentPagination
        meta={{
          ...baseMeta,
          page: 2,
          limit: 10,
          hasNextPage: true,
          hasPreviousPage: true,
        }}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: "다음 페이지로 이동",
      }),
    ).toHaveAttribute("href", `${URLS.CLIENT.CONTENTS}?page=3&limit=10`);
  });

  it("현재 페이지에 aria-current를 설정한다", () => {
    render(
      <ContentPagination
        meta={{
          ...baseMeta,
          page: 2,
          hasNextPage: true,
          hasPreviousPage: true,
        }}
      />,
    );

    expect(
      screen.getByRole("link", {
        name: "2 페이지로 이동",
      }),
    ).toHaveAttribute("aria-current", "page");
  });
});
