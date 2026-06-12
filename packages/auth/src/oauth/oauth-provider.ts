export const OAuthProviderIds = ["google", "naver", "kakao"] as const;

export type OAuthProviderId = (typeof OAuthProviderIds)[number];

export type OAuthAuthProvider = "GOOGLE" | "NAVER" | "KAKAO";

export interface OAuthProviderConfig {
  id: OAuthProviderId;
  authProvider: OAuthAuthProvider;
  label: string;
}

export const OAuthProviderConfigMap = {
  google: {
    id: "google",
    authProvider: "GOOGLE",
    label: "Google",
  },
  naver: {
    id: "naver",
    authProvider: "NAVER",
    label: "Naver",
  },
  kakao: {
    id: "kakao",
    authProvider: "KAKAO",
    label: "Kakao",
  },
} as const satisfies Record<OAuthProviderId, OAuthProviderConfig>;

export function isOAuthProviderId(value: string): value is OAuthProviderId {
  return OAuthProviderIds.some((providerId) => providerId === value);
}

export function parseOAuthProviderId(
  value: string | string[] | undefined,
): OAuthProviderId | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return null;
  }

  if (!isOAuthProviderId(value)) {
    return null;
  }

  return value;
}

export function getOAuthProviderConfig(
  providerId: OAuthProviderId,
): OAuthProviderConfig {
  return OAuthProviderConfigMap[providerId];
}

export function toOAuthAuthProvider(
  providerId: OAuthProviderId,
): OAuthAuthProvider {
  return getOAuthProviderConfig(providerId).authProvider;
}
