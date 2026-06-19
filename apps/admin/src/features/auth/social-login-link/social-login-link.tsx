"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { LinkButton } from "@repo/design-system/admin";

export type SocialLoginProviderId = "google" | "naver" | "kakao";

const SOCIAL_LOGIN_PROVIDER_META = {
  google: {
    name: "Google",
    description: "Google 계정으로 계속 진행합니다.",
  },
  naver: {
    name: "네이버",
    description: "네이버 계정으로 계속 진행합니다.",
  },
  kakao: {
    name: "카카오",
    description: "카카오 계정으로 계속 진행합니다.",
  },
} satisfies Record<
  SocialLoginProviderId,
  {
    name: string;
    description: string;
  }
>;

export interface SocialLoginLinkProps extends Omit<
  ComponentPropsWithoutRef<typeof LinkButton>,
  "children" | "href"
> {
  providerId: SocialLoginProviderId;
  href: string;
}

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

const SocialLoginLink = forwardRef<HTMLAnchorElement, SocialLoginLinkProps>(
  ({ providerId, href, className, "aria-label": ariaLabel, ...props }, ref) => {
    const provider = SOCIAL_LOGIN_PROVIDER_META[providerId];

    return (
      <LinkButton
        ref={ref}
        href={href}
        variant="outline"
        size="lg"
        aria-label={ariaLabel ?? `${provider.name}로 로그인`}
        data-provider={providerId}
        className={mergeClassNames("w-full justify-between gap-3", className)}
        {...props}
      >
        <span className="flex min-w-0 flex-col items-start text-left">
          <span className="text-sm font-semibold">{provider.name}로 로그인</span>
          <span className="text-muted-foreground text-xs font-normal">{provider.description}</span>
        </span>

        <span aria-hidden="true" className="text-muted-foreground text-sm">
          →
        </span>
      </LinkButton>
    );
  },
);

SocialLoginLink.displayName = "SocialLoginLink";

export default SocialLoginLink;
