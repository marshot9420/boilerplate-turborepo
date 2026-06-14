import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createSessionExpiresAt,
  createSessionToken,
  hashSessionToken,
} from "../session-token";

describe("session-token", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("세션 토큰을 생성한다", () => {
    const token = createSessionToken();

    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(token.length).toBeGreaterThan(0);
  });

  it("세션 토큰은 매번 다른 값으로 생성된다", () => {
    const tokens = Array.from({ length: 20 }, () => createSessionToken());

    expect(new Set(tokens).size).toBe(tokens.length);
  });

  it("세션 토큰을 sha256 hex 문자열로 해싱한다", () => {
    const token = "test-session-token";

    const tokenHash = hashSessionToken(token);

    expect(tokenHash).toHaveLength(64);
    expect(tokenHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("같은 세션 토큰은 같은 해시를 반환한다", () => {
    const token = "same-session-token";

    expect(hashSessionToken(token)).toBe(hashSessionToken(token));
  });

  it("만료 시간을 maxAgeSeconds 기준으로 생성한다", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    vi.spyOn(Date, "now").mockReturnValue(now.getTime());

    const expiresAt = createSessionExpiresAt(60);

    expect(expiresAt.toISOString()).toBe("2026-01-01T00:01:00.000Z");
  });
});
