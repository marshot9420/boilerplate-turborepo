import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { UserListQueryInput } from "@repo/domain/user/client";

import UserFilterForm from "./user-filter-form";

describe("UserFilterForm", () => {
  it("사용자 목록 필터 폼을 GET 방식으로 렌더링한다", () => {
    const query = {
      keyword: "mars",
      role: "ADMIN",
      status: "ACTIVE",
      sortKey: "EMAIL",
      sortDirection: "asc",
      limit: 50,
    } satisfies UserListQueryInput;

    const { container } = render(<UserFilterForm action="/users" query={query} />);

    const form = container.querySelector("form");

    expect(form).toHaveAttribute("method", "get");
    expect(form).toHaveAttribute("action", "/users");

    expect(screen.getByLabelText("검색어")).toHaveValue("mars");
    expect(screen.getByLabelText("권한")).toHaveValue("ADMIN");
    expect(screen.getByLabelText("상태")).toHaveValue("ACTIVE");

    expect(container.querySelector('input[name="sortKey"]')).toHaveValue("EMAIL");
    expect(container.querySelector('input[name="sortDirection"]')).toHaveValue("asc");
    expect(container.querySelector('input[name="limit"]')).toHaveValue("50");

    expect(screen.getByRole("button", { name: "조회" })).toHaveAttribute("type", "submit");
    expect(screen.getByRole("link", { name: "초기화" })).toHaveAttribute("href", "/users");
  });

  it("query가 없어도 기본 필터 폼을 렌더링한다", () => {
    render(<UserFilterForm action="/users" />);

    expect(screen.getByLabelText("검색어")).toHaveValue("");
    expect(screen.getByLabelText("권한")).toHaveValue("");
    expect(screen.getByLabelText("상태")).toHaveValue("");
  });
});
