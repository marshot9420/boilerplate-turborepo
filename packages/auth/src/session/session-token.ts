import { createHash, randomBytes } from "node:crypto";

const SESSION_TOKEN_BYTE_LENGTH = 32;

export function createSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTE_LENGTH).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionExpiresAt(maxAgeSeconds: number): Date {
  return new Date(Date.now() + maxAgeSeconds * 1000);
}
