import { randomUUID } from "node:crypto";

import { getMailRecipientEmails } from "../mail-address";
import type { MailerProvider, SendMailInput, SendMailResult } from "../types";
import { validateSendMailInput } from "../validate-send-mail-input";

export type ConsoleMailerProviderOptions = {
  log?: (payload: unknown) => void;
  createMessageId?: () => string;
};

export function createConsoleMailerProvider({
  log = console.info,
  createMessageId = randomUUID,
}: ConsoleMailerProviderOptions = {}): MailerProvider {
  return {
    name: "console",

    async sendMail(input: SendMailInput): Promise<SendMailResult> {
      const validationError = validateSendMailInput(input);

      if (validationError) {
        return {
          ok: false,
          error: validationError,
        };
      }

      const messageId = createMessageId();
      const accepted = getMailRecipientEmails(input);

      log({
        provider: "console",
        messageId,
        from: input.from,
        to: input.to,
        cc: input.cc,
        bcc: input.bcc,
        replyTo: input.replyTo,
        subject: input.subject,
        text: input.text,
        html: input.html,
        headers: input.headers,
        tags: input.tags,
        idempotencyKey: input.idempotencyKey,
      });

      return {
        ok: true,
        data: {
          messageId,
          provider: "console",
          accepted,
          rejected: [],
        },
      };
    },
  };
}
