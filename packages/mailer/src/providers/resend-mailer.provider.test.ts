import { describe, expect, it, vi } from "vitest";

import { createResendMailerProvider } from "./resend-mailer.provider";

describe("Resend Mailer Provider", () => {
  it("Resend SDK로 메일을 발송하고 성공 결과를 반환한다", async () => {
    const send = vi.fn().mockResolvedValue({
      data: {
        id: "resend-message-id",
      },
      error: null,
    });

    const mailer = createResendMailerProvider({
      defaultFrom: {
        email: "no-reply@example.com",
        name: "Example",
      },
      client: {
        emails: {
          send,
        },
      },
    });

    const result = await mailer.sendMail({
      to: [
        {
          email: "user@example.com",
          name: "User",
        },
      ],
      subject: "가입 완료",
      html: "<p>가입이 완료되었습니다.</p>",
      idempotencyKey: "welcome-user/user-id",
      tags: {
        type: "welcome",
      },
    });

    expect(result).toEqual({
      ok: true,
      data: {
        messageId: "resend-message-id",
        provider: "resend",
        accepted: ["user@example.com"],
        rejected: [],
        raw: {
          id: "resend-message-id",
        },
      },
    });

    expect(send).toHaveBeenCalledWith(
      {
        from: "Example <no-reply@example.com>",
        to: ["User <user@example.com>"],
        cc: undefined,
        bcc: undefined,
        replyTo: undefined,
        subject: "가입 완료",
        text: undefined,
        html: "<p>가입이 완료되었습니다.</p>",
        headers: undefined,
        tags: [
          {
            name: "type",
            value: "welcome",
          },
        ],
      },
      {
        idempotencyKey: "welcome-user/user-id",
      },
    );
  });

  it("API key와 client가 없으면 설정 오류를 반환한다", async () => {
    const mailer = createResendMailerProvider({
      defaultFrom: "no-reply@example.com",
    });

    const result = await mailer.sendMail({
      to: "user@example.com",
      subject: "테스트",
      text: "본문",
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "MAILER_NOT_CONFIGURED",
        message: "Resend API key가 설정되지 않았습니다.",
      },
    });
  });

  it("발신자가 없으면 입력 오류를 반환한다", async () => {
    const send = vi.fn();

    const mailer = createResendMailerProvider({
      client: {
        emails: {
          send,
        },
      },
    });

    const result = await mailer.sendMail({
      to: "user@example.com",
      subject: "테스트",
      text: "본문",
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "MAILER_INVALID_INPUT",
        message: "메일 발신자가 필요합니다.",
      },
    });

    expect(send).not.toHaveBeenCalled();
  });

  it("Resend가 error를 반환하면 provider error를 반환한다", async () => {
    const providerError = {
      message: "Invalid API key",
    };

    const mailer = createResendMailerProvider({
      defaultFrom: "no-reply@example.com",
      client: {
        emails: {
          send: vi.fn().mockResolvedValue({
            data: null,
            error: providerError,
          }),
        },
      },
    });

    const result = await mailer.sendMail({
      to: "user@example.com",
      subject: "테스트",
      text: "본문",
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "MAILER_PROVIDER_ERROR",
        message: "Invalid API key",
        cause: providerError,
      },
    });
  });
});
