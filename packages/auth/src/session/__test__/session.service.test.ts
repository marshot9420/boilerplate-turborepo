import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createAuthSession,
  getAuthSessionByToken,
  getCurrentAuthSession,
  revokeAuthSessionByToken,
  revokeCurrentAuthSession,
} from "../session.service";

const mocks = vi.hoisted(() => ({
  createUserSessionRepository: vi.fn(),
  findUserSessionWithUserByTokenHashRepository: vi.fn(),
  revokeUserSessionByTokenHashRepository: vi.fn(),

  updateUserRepository: vi.fn(),

  getSessionCookieValue: vi.fn(),
  setSessionCookie: vi.fn(),
  deleteSessionCookie: vi.fn(),

  createSessionToken: vi.fn(),
  hashSessionToken: vi.fn(),
  createSessionExpiresAt: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@repo/database/user-session", () => ({
  createUserSessionRepository: mocks.createUserSessionRepository,
  findUserSessionWithUserByTokenHashRepository:
    mocks.findUserSessionWithUserByTokenHashRepository,
  revokeUserSessionByTokenHashRepository:
    mocks.revokeUserSessionByTokenHashRepository,
}));

vi.mock("@repo/database/user", () => ({
  updateUserRepository: mocks.updateUserRepository,
}));

vi.mock("@repo/env/server", () => ({
  serverEnv: {
    NODE_ENV: "test",
    AUTH_SESSION_COOKIE_NAME: "test_session",
    AUTH_SESSION_MAX_AGE_SECONDS: 60 * 60,
  },
}));

vi.mock("../session-cookie", () => ({
  getSessionCookieValue: mocks.getSessionCookieValue,
  setSessionCookie: mocks.setSessionCookie,
  deleteSessionCookie: mocks.deleteSessionCookie,
}));

vi.mock("../session-token", () => ({
  createSessionToken: mocks.createSessionToken,
  hashSessionToken: mocks.hashSessionToken,
  createSessionExpiresAt: mocks.createSessionExpiresAt,
}));

const NOW = new Date("2026-01-01T00:00:00.000Z");
const EXPIRES_AT = new Date("2026-01-01T01:00:00.000Z");

function createDatabaseSessionWithUser(
  override?: Partial<{
    id: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    user: Partial<{
      id: string;
      email: string;
      name: string | null;
      avatarUrl: string | null;
      nickname: string;
      role: "USER" | "ADMIN";
      status: "ACTIVE" | "SUSPENDED" | "BANNED" | "DELETED";
      deletedAt: Date | null;
    }>;
  }>,
) {
  return {
    id: override?.id ?? "session-id",
    tokenHash: override?.tokenHash ?? "hashed-token",
    expiresAt: override?.expiresAt ?? EXPIRES_AT,
    revokedAt: override?.revokedAt ?? null,
    ipAddress: null,
    userAgent: null,
    createdAt: NOW,
    updatedAt: NOW,
    userId: override?.user?.id ?? "user-id",
    user: {
      id: override?.user?.id ?? "user-id",
      email: override?.user?.email ?? "user@example.com",
      name: override?.user?.name ?? "User",
      avatarUrl: override?.user?.avatarUrl ?? "https://example.com/avatar.png",
      nickname: override?.user?.nickname ?? "user_nickname",
      role: override?.user?.role ?? "USER",
      status: override?.user?.status ?? "ACTIVE",
      createdAt: NOW,
      updatedAt: NOW,
      lastLoginAt: null,
      deletedAt: override?.user?.deletedAt ?? null,
    },
  };
}

describe("session.service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    vi.clearAllMocks();

    mocks.createSessionToken.mockReturnValue("raw-session-token");
    mocks.hashSessionToken.mockReturnValue("hashed-token");
    mocks.createSessionExpiresAt.mockReturnValue(EXPIRES_AT);

    mocks.setSessionCookie.mockResolvedValue(undefined);
    mocks.deleteSessionCookie.mockResolvedValue(undefined);
    mocks.updateUserRepository.mockResolvedValue(
      createDatabaseSessionWithUser().user,
    );
    mocks.revokeUserSessionByTokenHashRepository.mockResolvedValue(1);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("인증 세션을 생성하고 세션 쿠키를 저장한다", async () => {
    mocks.createUserSessionRepository.mockResolvedValue({
      id: "session-id",
      tokenHash: "hashed-token",
      expiresAt: EXPIRES_AT,
      revokedAt: null,
      ipAddress: "127.0.0.1",
      userAgent: "Vitest",
      createdAt: NOW,
      updatedAt: NOW,
      userId: "user-id",
    });

    const result = await createAuthSession({
      userId: "user-id",
      ipAddress: "127.0.0.1",
      userAgent: "Vitest",
    });

    expect(mocks.createSessionToken).toHaveBeenCalledOnce();
    expect(mocks.hashSessionToken).toHaveBeenCalledWith("raw-session-token");
    expect(mocks.createSessionExpiresAt).toHaveBeenCalledWith(3600);

    expect(mocks.createUserSessionRepository).toHaveBeenCalledWith({
      tokenHash: "hashed-token",
      expiresAt: EXPIRES_AT,
      ipAddress: "127.0.0.1",
      userAgent: "Vitest",
      user: {
        connect: {
          id: "user-id",
        },
      },
    });

    expect(mocks.updateUserRepository).toHaveBeenCalledWith("user-id", {
      lastLoginAt: NOW,
    });

    expect(mocks.setSessionCookie).toHaveBeenCalledWith("raw-session-token");

    expect(result).toEqual({
      token: "raw-session-token",
      sessionId: "session-id",
      expiresAt: EXPIRES_AT,
    });
  });

  it("토큰으로 유효한 인증 세션을 조회한다", async () => {
    mocks.findUserSessionWithUserByTokenHashRepository.mockResolvedValue(
      createDatabaseSessionWithUser(),
    );

    const result = await getAuthSessionByToken("raw-session-token");

    expect(mocks.hashSessionToken).toHaveBeenCalledWith("raw-session-token");
    expect(
      mocks.findUserSessionWithUserByTokenHashRepository,
    ).toHaveBeenCalledWith("hashed-token");

    expect(result).toEqual({
      id: "session-id",
      expiresAt: EXPIRES_AT,
      revokedAt: null,
      user: {
        id: "user-id",
        email: "user@example.com",
        name: "User",
        avatarUrl: "https://example.com/avatar.png",
        nickname: "user_nickname",
        role: "USER",
        status: "ACTIVE",
      },
    });
  });

  it("토큰에 해당하는 세션이 없으면 null을 반환한다", async () => {
    mocks.findUserSessionWithUserByTokenHashRepository.mockResolvedValue(null);

    await expect(
      getAuthSessionByToken("raw-session-token"),
    ).resolves.toBeNull();
  });

  it("폐기된 세션이면 null을 반환한다", async () => {
    mocks.findUserSessionWithUserByTokenHashRepository.mockResolvedValue(
      createDatabaseSessionWithUser({
        revokedAt: new Date("2026-01-01T00:10:00.000Z"),
      }),
    );

    await expect(
      getAuthSessionByToken("raw-session-token"),
    ).resolves.toBeNull();
  });

  it("만료된 세션이면 null을 반환한다", async () => {
    mocks.findUserSessionWithUserByTokenHashRepository.mockResolvedValue(
      createDatabaseSessionWithUser({
        expiresAt: new Date("2025-12-31T23:59:59.000Z"),
      }),
    );

    await expect(
      getAuthSessionByToken("raw-session-token"),
    ).resolves.toBeNull();
  });

  it("사용자 상태가 ACTIVE가 아니면 null을 반환한다", async () => {
    mocks.findUserSessionWithUserByTokenHashRepository.mockResolvedValue(
      createDatabaseSessionWithUser({
        user: {
          status: "BANNED",
        },
      }),
    );

    await expect(
      getAuthSessionByToken("raw-session-token"),
    ).resolves.toBeNull();
  });

  it("삭제된 사용자면 null을 반환한다", async () => {
    mocks.findUserSessionWithUserByTokenHashRepository.mockResolvedValue(
      createDatabaseSessionWithUser({
        user: {
          deletedAt: new Date("2026-01-01T00:10:00.000Z"),
        },
      }),
    );

    await expect(
      getAuthSessionByToken("raw-session-token"),
    ).resolves.toBeNull();
  });

  it("현재 세션 쿠키가 없으면 현재 인증 세션은 null이다", async () => {
    mocks.getSessionCookieValue.mockResolvedValue(undefined);

    const result = await getCurrentAuthSession();

    expect(result).toBeNull();
    expect(
      mocks.findUserSessionWithUserByTokenHashRepository,
    ).not.toHaveBeenCalled();
  });

  it("현재 세션 쿠키가 있으면 현재 인증 세션을 조회한다", async () => {
    mocks.getSessionCookieValue.mockResolvedValue("raw-session-token");
    mocks.findUserSessionWithUserByTokenHashRepository.mockResolvedValue(
      createDatabaseSessionWithUser(),
    );

    const result = await getCurrentAuthSession();

    expect(mocks.getSessionCookieValue).toHaveBeenCalledOnce();
    expect(result?.id).toBe("session-id");
    expect(result?.user.id).toBe("user-id");
  });

  it("토큰으로 인증 세션을 폐기한다", async () => {
    const result = await revokeAuthSessionByToken("raw-session-token");

    expect(mocks.hashSessionToken).toHaveBeenCalledWith("raw-session-token");
    expect(mocks.revokeUserSessionByTokenHashRepository).toHaveBeenCalledWith(
      "hashed-token",
    );
    expect(result).toBe(1);
  });

  it("현재 세션 쿠키가 있으면 DB 세션을 폐기하고 쿠키를 삭제한다", async () => {
    mocks.getSessionCookieValue.mockResolvedValue("raw-session-token");

    await revokeCurrentAuthSession();

    expect(mocks.revokeUserSessionByTokenHashRepository).toHaveBeenCalledWith(
      "hashed-token",
    );
    expect(mocks.deleteSessionCookie).toHaveBeenCalledOnce();
  });

  it("현재 세션 쿠키가 없어도 쿠키 삭제는 호출한다", async () => {
    mocks.getSessionCookieValue.mockResolvedValue(undefined);

    await revokeCurrentAuthSession();

    expect(mocks.revokeUserSessionByTokenHashRepository).not.toHaveBeenCalled();
    expect(mocks.deleteSessionCookie).toHaveBeenCalledOnce();
  });
});
