import { randomUUID } from "node:crypto";

import { getMailRecipientEmails } from "../mail-address";
import type { MailerProvider, SendMailInput, SendMailResult } from "../types";
import { validateSendMailInput } from "../validate-send-mail-input";

export type SentMail = {
  messageId: string;
  input: SendMailInput;
  sentAt: Date;
};

export type FakeMailerProvider = MailerProvider & {
  getSentMails(): readonly SentMail[];
  clear(): void;
};

export type FakeMailerProviderOptions = {
  createMessageId?: () => string;
  now?: () => Date;
};

export function createFakeMailerProvider({
  createMessageId = randomUUID,
  now = () => new Date(),
}: FakeMailerProviderOptions = {}): FakeMailerProvider {
  const sentMails: SentMail[] = [];

  return {
    name: "fake",

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

      sentMails.push({
        messageId,
        input,
        sentAt: now(),
      });

      return {
        ok: true,
        data: {
          messageId,
          provider: "fake",
          accepted,
          rejected: [],
        },
      };
    },

    getSentMails() {
      return [...sentMails];
    },

    clear() {
      sentMails.length = 0;
    },
  };
}
