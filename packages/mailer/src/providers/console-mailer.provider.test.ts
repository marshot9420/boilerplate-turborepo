import { describe, expect, it, vi } from "vitest";

import { createConsoleMailerProvider } from "./console-mailer.provider";

describe("Console Mailer Provider", () => {
  it("메일 입력값을 로그로 출력하고 성공 결과를 반환한다", async () => {
    const log = vi.fn();
    const mailer = createConsoleMailerProvider({
      log,
      createMessageId: () => "test-message-id",
    });

    const result = await mailer.sendMail({
      to: "user@example.com",
      subject: "테스트 메일",
      text: "본문입니다.",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        messageId: "test-message-id",
        provider: "console",
        accepted: ["user@example.com"],
        rejected: [],
      },
    });

    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "console",
        messageId: "test-message-id",
        to: "user@example.com",
        subject: "테스트 메일",
        text: "본문입니다.",
      }),
    );
  });

  it("본문이 없으면 실패 결과를 반환한다", async () => {
    const mailer = createConsoleMailerProvider({
      log: vi.fn(),
      createMessageId: () => "test-message-id",
    });

    const result = await mailer.sendMail({
      to: "user@example.com",
      subject: "테스트 메일",
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "MAILER_INVALID_INPUT",
        message: "메일 본문이 필요합니다.",
      },
    });
  });
});
