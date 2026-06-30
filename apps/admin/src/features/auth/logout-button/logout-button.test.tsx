import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { URLS } from "@/constants";

import LogoutButton from "./logout-button";

describe("LogoutButton", () => {
  it("로그아웃 form과 submit button을 렌더링한다", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "로그아웃" });
    const form = button.closest("form");

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
    expect(form).toHaveAttribute("method", "post");
    expect(form).toHaveAttribute("action", URLS.API.AUTH.LOGOUT);
  });

  it("children을 전달하면 버튼 문구를 변경한다", () => {
    render(<LogoutButton>나가기</LogoutButton>);

    expect(screen.getByRole("button", { name: "나가기" })).toBeInTheDocument();
  });

  it("form과 button className을 전달할 수 있다", () => {
    render(<LogoutButton className="form-class" buttonClassName="button-class" />);

    const button = screen.getByRole("button", { name: "로그아웃" });
    const form = button.closest("form");

    expect(form).toHaveClass("form-class");
    expect(button).toHaveClass("button-class");
  });
});
