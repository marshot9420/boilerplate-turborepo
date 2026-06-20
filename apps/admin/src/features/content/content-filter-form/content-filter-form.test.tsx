import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { URLS } from "@/constants";

import ContentFilterForm from "./content-filter-form";

describe("ContentFilterForm", () => {
  it("콘텐츠 필터 폼을 렌더링한다", () => {
    render(<ContentFilterForm />);

    expect(screen.getByLabelText("상태")).toHaveValue("");
    expect(screen.getByLabelText("작성자 ID")).toHaveValue("");
    expect(screen.getByLabelText("표시 개수")).toHaveValue("20");

    expect(screen.getByRole("button", { name: "조회" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "초기화" })).toHaveAttribute(
      "href",
      URLS.CLIENT.CONTENTS,
    );
  });

  it("기본 필터 값을 반영한다", () => {
    render(
      <ContentFilterForm
        defaultValues={{
          status: "HIDDEN",
          authorId: "00000000-0000-4000-8000-000000000001",
          limit: "50",
        }}
      />,
    );

    expect(screen.getByLabelText("상태")).toHaveValue("HIDDEN");
    expect(screen.getByLabelText("작성자 ID")).toHaveValue("00000000-0000-4000-8000-000000000001");
    expect(screen.getByLabelText("표시 개수")).toHaveValue("50");
  });

  it("배열 형태의 기본 필터 값은 첫 번째 값을 사용한다", () => {
    render(
      <ContentFilterForm
        defaultValues={{
          status: ["DELETED", "HIDDEN"],
          authorId: ["author-id-1", "author-id-2"],
          limit: ["100", "20"],
        }}
      />,
    );

    expect(screen.getByLabelText("상태")).toHaveValue("DELETED");
    expect(screen.getByLabelText("작성자 ID")).toHaveValue("author-id-1");
    expect(screen.getByLabelText("표시 개수")).toHaveValue("100");
  });
});
