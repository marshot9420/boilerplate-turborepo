import { describe, expect, it } from "vitest";

import { createFakeMailerProvider } from "./fake-mailer.provider";

describe("Fake Mailer Provider", () => {
  it("발송된 메일을 메모리에 기록한다", async () => {
    const sentAt = new Date("2026-06-29T00:00:00.000Z");

    const mailer = createFakeMailerProvider({
      createMessageId: () => "fake-message-id",
      now: () => sentAt,
    });

    const result = await mailer.sendMail({
      from: {
        email: "no-reply@example.com",
        name: "Example",
      },
      to: ["user@example.com", "admin@example.com"],
      subject: "가입 완료",
      html: "<p>가입이 완료되었습니다.</p>",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        messageId: "fake-message-id",
        provider: "fake",
        accepted: ["user@example.com", "admin@example.com"],
        rejected: [],
      },
    });

    expect(mailer.getSentMails()).toEqual([
      {
        messageId: "fake-message-id",
        input: {
          from: {
            email: "no-reply@example.com",
            name: "Example",
          },
          to: ["user@example.com", "admin@example.com"],
          subject: "가입 완료",
          html: "<p>가입이 완료되었습니다.</p>",
        },
        sentAt,
      },
    ]);
  });

  it("clear를 호출하면 발송 기록을 비운다", async () => {
    const mailer = createFakeMailerProvider();

    await mailer.sendMail({
      to: "user@example.com",
      subject: "테스트",
      text: "본문",
    });

    expect(mailer.getSentMails()).toHaveLength(1);

    mailer.clear();

    expect(mailer.getSentMails()).toHaveLength(0);
  });
});
