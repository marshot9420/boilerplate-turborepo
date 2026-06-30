import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import UserRoleBadge from "./user-role-badge";

describe("UserRoleBadge", () => {
  it("일반 사용자 권한 배지를 렌더링한다", () => {
    render(<UserRoleBadge role="USER" />);

    expect(screen.getByText("일반 사용자")).toBeInTheDocument();
  });

  it("관리자 권한 배지를 렌더링한다", () => {
    render(<UserRoleBadge role="ADMIN" />);

    expect(screen.getByText("관리자")).toBeInTheDocument();
  });
});
