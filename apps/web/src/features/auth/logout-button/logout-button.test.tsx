import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { URLS } from "@/constants";

import LogoutButton from "./logout-button";

describe("LogoutButton", () => {
  it("로그아웃 API 라우트로 POST form을 렌더링한다", () => {
    render(<LogoutButton />);

    const form = screen.getByRole("form", { name: "로그아웃" });

    expect(form).toHaveAttribute("action", URLS.API.AUTH.LOGOUT);
    expect(form).toHaveAttribute("method", "post");
  });

  it("로그아웃 submit 버튼을 렌더링한다", () => {
    render(<LogoutButton />);

    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
  });

  it("버튼 라벨과 form aria-label을 변경할 수 있다", () => {
    render(<LogoutButton label="나가기" formAriaLabel="서비스 로그아웃" />);

    expect(screen.getByRole("form", { name: "서비스 로그아웃" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "나가기" })).toBeInTheDocument();
  });
});
