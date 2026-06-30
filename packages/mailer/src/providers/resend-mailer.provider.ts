import { Resend } from "resend";

import { formatMailAddress, formatMailAddressList, getMailRecipientEmails } from "../mail-address";
import type { MailAddress, MailerProvider, SendMailInput, SendMailResult } from "../types";
import { validateSendMailInput } from "../validate-send-mail-input";

type ResendEmailTag = {
  name: string;
  value: string;
};

type ResendSendEmailPayloadBase = {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  subject: string;
  headers?: Record<string, string>;
  tags?: ResendEmailTag[];
};

type ResendSendEmailPayload =
  | (ResendSendEmailPayloadBase & {
      html: string;
      text?: string;
    })
  | (ResendSendEmailPayloadBase & {
      text: string;
      html?: never;
    });

type ResendSendEmailOptions = {
  idempotencyKey?: string;
};

type ResendSendEmailResponse = {
  data: {
    id: string;
  } | null;
  error: unknown;
};

type ResendEmailClient = {
  emails: {
    send(
      payload: ResendSendEmailPayload,
      options?: ResendSendEmailOptions,
    ): Promise<ResendSendEmailResponse>;
  };
};

export type ResendMailerProviderOptions = {
  apiKey?: string;
  defaultFrom?: MailAddress;
  client?: ResendEmailClient;
};

export function createResendMailerProvider({
  apiKey,
  defaultFrom,
  client,
}: ResendMailerProviderOptions): MailerProvider {
  const resendClient = client ?? createResendEmailClient(apiKey);

  return {
    name: "resend",

    async sendMail(input: SendMailInput): Promise<SendMailResult> {
      if (!resendClient) {
        return {
          ok: false,
          error: {
            code: "MAILER_NOT_CONFIGURED",
            message: "Resend API key가 설정되지 않았습니다.",
          },
        };
      }

      const from = input.from ?? defaultFrom;

      if (!from) {
        return {
          ok: false,
          error: {
            code: "MAILER_INVALID_INPUT",
            message: "메일 발신자가 필요합니다.",
          },
        };
      }

      const validationError = validateSendMailInput({
        ...input,
        from,
      });

      if (validationError) {
        return {
          ok: false,
          error: validationError,
        };
      }

      const payloadBase: ResendSendEmailPayloadBase = {
        from: formatMailAddress(from),
        to: formatMailAddressList(input.to) ?? [],
        subject: input.subject,
        ...(input.cc ? { cc: formatMailAddressList(input.cc) } : {}),
        ...(input.bcc ? { bcc: formatMailAddressList(input.bcc) } : {}),
        ...(input.replyTo ? { replyTo: formatMailAddress(input.replyTo) } : {}),
        ...(input.headers ? { headers: input.headers } : {}),
        ...(input.tags ? { tags: toResendTags(input.tags) } : {}),
      };

      const payload = createResendSendEmailPayload(payloadBase, input);

      const { data, error } = await resendClient.emails.send(
        payload,
        input.idempotencyKey
          ? {
              idempotencyKey: input.idempotencyKey,
            }
          : undefined,
      );

      if (error) {
        return {
          ok: false,
          error: {
            code: "MAILER_PROVIDER_ERROR",
            message: getProviderErrorMessage(error),
            cause: error,
          },
        };
      }

      if (!data?.id) {
        return {
          ok: false,
          error: {
            code: "MAILER_PROVIDER_ERROR",
            message: "Resend 응답에 email id가 없습니다.",
            cause: data,
          },
        };
      }

      return {
        ok: true,
        data: {
          messageId: data.id,
          provider: "resend",
          accepted: getMailRecipientEmails(input),
          rejected: [],
          raw: data,
        },
      };
    },
  };
}

function createResendEmailClient(apiKey: string | undefined): ResendEmailClient | null {
  const trimmedApiKey = apiKey?.trim();

  if (!trimmedApiKey) {
    return null;
  }

  const resend = new Resend(trimmedApiKey);

  return {
    emails: {
      send(payload, options) {
        return resend.emails.send(payload, options);
      },
    },
  };
}

function createResendSendEmailPayload(
  payloadBase: ResendSendEmailPayloadBase,
  input: SendMailInput,
): ResendSendEmailPayload {
  if (input.html?.trim()) {
    return {
      ...payloadBase,
      html: input.html,
      ...(input.text?.trim() ? { text: input.text } : {}),
    };
  }

  if (input.text?.trim()) {
    return {
      ...payloadBase,
      text: input.text,
    };
  }

  throw new Error("메일 본문이 필요합니다.");
}

function toResendTags(tags: Record<string, string> | undefined): ResendEmailTag[] | undefined {
  if (!tags) {
    return undefined;
  }

  const resendTags = Object.entries(tags)
    .filter(([name, value]) => name.trim() && value.trim())
    .map(([name, value]) => ({
      name,
      value,
    }));

  if (resendTags.length === 0) {
    return undefined;
  }

  return resendTags;
}

function getProviderErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Resend 메일 발송에 실패했습니다.";
}
