import "server-only";

export type { ConsoleMailerProviderOptions } from "./providers/console-mailer.provider";
export { createConsoleMailerProvider } from "./providers/console-mailer.provider";
export type { ResendMailerProviderOptions } from "./providers/resend-mailer.provider";
export { createResendMailerProvider } from "./providers/resend-mailer.provider";
export type {
  MailAddress,
  MailerError,
  MailerErrorCode,
  MailerProvider,
  SendMailInput,
  SendMailResult,
  SendMailSuccess,
} from "./types";
