import { serverEnv } from "@repo/env/server";
import { createConsoleMailerProvider, createResendMailerProvider } from "@repo/mailer/server";

export const mailer =
  serverEnv.MAIL_PROVIDER === "resend"
    ? createResendMailerProvider({
        apiKey: serverEnv.RESEND_API_KEY,
        defaultFrom: serverEnv.MAIL_FROM,
      })
    : createConsoleMailerProvider();
