export type MailAddress =
  | string
  | {
      email: string;
      name?: string;
    };

export type SendMailInput = {
  from?: MailAddress;
  to: MailAddress | MailAddress[];
  cc?: MailAddress | MailAddress[];
  bcc?: MailAddress | MailAddress[];
  replyTo?: MailAddress;
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
  tags?: Record<string, string>;
  idempotencyKey?: string;
};

export type SendMailSuccess = {
  messageId: string;
  provider: string;
  accepted: string[];
  rejected: string[];
  raw?: unknown;
};

export type MailerErrorCode =
  | "MAILER_INVALID_INPUT"
  | "MAILER_NOT_CONFIGURED"
  | "MAILER_PROVIDER_ERROR";

export type MailerError = {
  code: MailerErrorCode;
  message: string;
  cause?: unknown;
};

export type SendMailResult =
  | {
      ok: true;
      data: SendMailSuccess;
    }
  | {
      ok: false;
      error: MailerError;
    };

export type MailerProvider = {
  readonly name: string;
  sendMail(input: SendMailInput): Promise<SendMailResult>;
};
