import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ContentResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

import ContentTable from "./content-table";
import { formatContentDate } from "../../lib";

describe("ContentTable", () => {
  const firstContent: ContentResponse = {
    id: "content-id-1",
    title: "첫 번째 콘텐츠",
    status: "PUBLISHED",
    authorId: "author-id-1",
    createdAt: "2026-06-20T00:00:00.000Z",
    updatedAt: "2026-06-20T01:00:00.000Z",
  };

  const secondContent: ContentResponse = {
    id: "content-id-2",
    title: "두 번째 콘텐츠",
    status: "HIDDEN",
    authorId: "author-id-2",
    createdAt: "2026-06-21T00:00:00.000Z",
    updatedAt: "2026-06-21T01:00:00.000Z",
  };

  const contents: ContentResponse[] = [firstContent, secondContent];

  it("콘텐츠 목록 테이블을 렌더링한다", () => {
    render(<ContentTable contents={contents} />);

    expect(screen.getByRole("columnheader", { name: "제목" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "상태" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "작성자" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "생성일" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "수정일" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "관리" })).toBeInTheDocument();

    expect(screen.getByText("첫 번째 콘텐츠")).toBeInTheDocument();
    expect(screen.getByText("content-id-1")).toBeInTheDocument();
    expect(screen.getByText("author-id-1")).toBeInTheDocument();
    expect(screen.getByText("공개")).toBeInTheDocument();

    expect(screen.getByText("두 번째 콘텐츠")).toBeInTheDocument();
    expect(screen.getByText("content-id-2")).toBeInTheDocument();
    expect(screen.getByText("author-id-2")).toBeInTheDocument();
    expect(screen.getByText("숨김")).toBeInTheDocument();

    expect(screen.getByText(formatContentDate(firstContent.createdAt))).toBeInTheDocument();
    expect(screen.getByText(formatContentDate(firstContent.updatedAt))).toBeInTheDocument();
  });

  it("각 콘텐츠 상세 링크를 렌더링한다", () => {
    render(<ContentTable contents={contents} />);

    const links = screen.getAllByRole("link", { name: "상세" });

    const firstLink = links[0];
    const secondLink = links[1];

    expect(firstLink).toBeDefined();
    expect(secondLink).toBeDefined();

    if (!firstLink || !secondLink) {
      throw new Error("상세 링크가 렌더링되지 않았습니다.");
    }

    expect(firstLink).toHaveAttribute("href", `${URLS.CLIENT.CONTENTS}/${firstContent.id}`);
    expect(secondLink).toHaveAttribute("href", `${URLS.CLIENT.CONTENTS}/${secondContent.id}`);
  });
});
