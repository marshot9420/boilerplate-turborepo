import type { OAuthAuthProvider } from "./oauth-provider";

export interface OAuthProfile {
  provider: OAuthAuthProvider;
  providerUserId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}
