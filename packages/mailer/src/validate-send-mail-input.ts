import { normalizeMailAddress, normalizeMailAddressList } from "./mail-address";
import type { MailerError, SendMailInput } from "./types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSendMailInput(input: SendMailInput): MailerError | null {
  const recipients = normalizeMailAddressList(input.to);

  if (recipients.length === 0) {
    return {
      code: "MAILER_INVALID_INPUT",
      message: "메일 수신자가 필요합니다.",
    };
  }

  if (!input.subject.trim()) {
    return {
      code: "MAILER_INVALID_INPUT",
      message: "메일 제목이 필요합니다.",
    };
  }

  if (!input.text?.trim() && !input.html?.trim()) {
    return {
      code: "MAILER_INVALID_INPUT",
      message: "메일 본문이 필요합니다.",
    };
  }

  if (input.idempotencyKey && input.idempotencyKey.length > 256) {
    return {
      code: "MAILER_INVALID_INPUT",
      message: "메일 idempotency key는 256자를 초과할 수 없습니다.",
    };
  }

  const addresses = [
    ...recipients,
    ...normalizeMailAddressList(input.cc),
    ...normalizeMailAddressList(input.bcc),
    ...(input.from ? [normalizeMailAddress(input.from)] : []),
    ...(input.replyTo ? [normalizeMailAddress(input.replyTo)] : []),
  ];

  const invalidAddress = addresses.find((address) => !emailPattern.test(address.email));

  if (invalidAddress) {
    return {
      code: "MAILER_INVALID_INPUT",
      message: `유효하지 않은 이메일 주소입니다: ${invalidAddress.email}`,
    };
  }

  return null;
}
