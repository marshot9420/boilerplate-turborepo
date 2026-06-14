import Link from "next/link";

import { URLS } from "@/constants";

const OAuthLoginProviders = [
  {
    href: URLS.API.AUTH.GOOGLE,
    label: "Google로 계속하기",
  },

  {
    href: URLS.API.AUTH.NAVER,
    label: "Naver로 계속하기",
  },

  {
    href: URLS.API.AUTH.KAKAO,
    label: "Kakao로 계속하기",
  },
] as const;

export default function SocialLoginButtons() {
  return (
    <div className="flex w-full flex-col gap-3">
      {OAuthLoginProviders.map((provider) => (
        <form key={provider.href} action={provider.href} method="get">
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            {provider.label}
          </button>
        </form>
      ))}
    </div>
  );
}
