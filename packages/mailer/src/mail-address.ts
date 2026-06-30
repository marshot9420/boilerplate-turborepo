import type { MailAddress, SendMailInput } from "./types";

export type NormalizedMailAddress = {
  email: string;
  name?: string;
};

export function normalizeMailAddress(address: MailAddress): NormalizedMailAddress {
  if (typeof address === "string") {
    return {
      email: address.trim(),
    };
  }

  return {
    email: address.email.trim(),
    name: address.name?.trim() || undefined,
  };
}

export function normalizeMailAddressList(
  addresses: MailAddress | MailAddress[] | undefined,
): NormalizedMailAddress[] {
  if (!addresses) {
    return [];
  }

  if (Array.isArray(addresses)) {
    return addresses.map(normalizeMailAddress);
  }

  return [normalizeMailAddress(addresses)];
}

export function formatMailAddress(address: MailAddress): string {
  const normalizedAddress = normalizeMailAddress(address);

  if (!normalizedAddress.name) {
    return normalizedAddress.email;
  }

  const safeName = normalizedAddress.name.replace(/[<>"]/g, "").trim();

  if (!safeName) {
    return normalizedAddress.email;
  }

  return `${safeName} <${normalizedAddress.email}>`;
}

export function formatMailAddressList(
  addresses: MailAddress | MailAddress[] | undefined,
): string[] | undefined {
  const normalizedAddresses = normalizeMailAddressList(addresses);

  if (normalizedAddresses.length === 0) {
    return undefined;
  }

  return normalizedAddresses.map((address) => {
    if (!address.name) {
      return address.email;
    }

    return formatMailAddress(address);
  });
}

export function getMailRecipientEmails(input: Pick<SendMailInput, "to" | "cc" | "bcc">) {
  return [
    ...normalizeMailAddressList(input.to),
    ...normalizeMailAddressList(input.cc),
    ...normalizeMailAddressList(input.bcc),
  ].map((address) => address.email);
}
