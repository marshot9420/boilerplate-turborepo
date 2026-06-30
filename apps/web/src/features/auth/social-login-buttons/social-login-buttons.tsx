"use client";

import { LinkButton } from "@repo/design-system/web";

import { URLS } from "@/constants";

export type SocialLoginProviderId = "google" | "naver" | "kakao";

interface SocialLoginProvider {
  id: SocialLoginProviderId;
  label: string;
  description: string;
  href: string;
}

const SOCIAL_LOGIN_PROVIDERS = [
  {
    id: "google",
    label: "Google",
    description: "Google 계정으로 계속하기",
    href: URLS.API.AUTH.GOOGLE,
  },
  {
    id: "naver",
    label: "Naver",
    description: "Naver 계정으로 계속하기",
    href: URLS.API.AUTH.NAVER,
  },
  {
    id: "kakao",
    label: "Kakao",
    description: "Kakao 계정으로 계속하기",
    href: URLS.API.AUTH.KAKAO,
  },
] satisfies SocialLoginProvider[];

export interface SocialLoginButtonsProps {
  className?: string;
  providers?: readonly SocialLoginProviderId[];
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function getVisibleProviders(providerIds: readonly SocialLoginProviderId[] | undefined) {
  if (!providerIds) {
    return SOCIAL_LOGIN_PROVIDERS;
  }

  const providerIdSet = new Set(providerIds);

  return SOCIAL_LOGIN_PROVIDERS.filter((provider) => providerIdSet.has(provider.id));
}

export default function SocialLoginButtons({ className, providers }: SocialLoginButtonsProps) {
  const visibleProviders = getVisibleProviders(providers);

  if (visibleProviders.length === 0) {
    return null;
  }

  return (
    <div aria-label="소셜 로그인" className={joinClassNames("grid gap-3", className)}>
      {visibleProviders.map((provider) => (
        <LinkButton
          key={provider.id}
          href={provider.href}
          variant="outline"
          size="lg"
          className="w-full justify-between rounded-xl px-5"
        >
          <span className="font-semibold">{provider.label}</span>
          <span className="text-muted-foreground text-xs">{provider.description}</span>
        </LinkButton>
      ))}
    </div>
  );
}
