import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { UserListItemResponse } from "@repo/domain/user/client";

import UserStatusBadge from "./user-status-badge";

const cases = [
  ["ACTIVE", "활성"],
  ["SUSPENDED", "정지"],
  ["BANNED", "차단"],
  ["DELETED", "삭제"],
] satisfies Array<[UserListItemResponse["status"], string]>;

describe("UserStatusBadge", () => {
  it.each(cases)("%s 상태 배지를 렌더링한다", (status, label) => {
    render(<UserStatusBadge status={status} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
