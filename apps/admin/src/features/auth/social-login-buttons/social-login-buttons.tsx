import { URLS } from "@/constants";

import { SocialLoginLink, type SocialLoginProviderId } from "../social-login-link";

interface SocialLoginProvider {
  providerId: SocialLoginProviderId;
  href: string;
}

const DEFAULT_SOCIAL_LOGIN_PROVIDERS = [
  {
    providerId: "google",
    href: URLS.API.AUTH.GOOGLE,
  },
  {
    providerId: "naver",
    href: URLS.API.AUTH.NAVER,
  },
  {
    providerId: "kakao",
    href: URLS.API.AUTH.KAKAO,
  },
] as const satisfies readonly SocialLoginProvider[];

export interface SocialLoginButtonsProps {
  className?: string;
  providers?: readonly SocialLoginProvider[];
}

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function SocialLoginButtons({
  className,
  providers = DEFAULT_SOCIAL_LOGIN_PROVIDERS,
}: SocialLoginButtonsProps) {
  return (
    <div aria-label="소셜 로그인" className={mergeClassNames("grid gap-3", className)}>
      {providers.map((provider) => (
        <SocialLoginLink
          key={provider.providerId}
          providerId={provider.providerId}
          href={provider.href}
        />
      ))}
    </div>
  );
}
