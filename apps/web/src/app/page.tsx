import Link from "next/link";

import { URLS } from "@/constants";

export const runtime = "nodejs";

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100dvh-12rem)] flex-col items-start justify-center gap-6">
      <div className="max-w-2xl space-y-4">
        <p className="text-muted-foreground text-sm font-medium">Turborepo Boilerplate</p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Web App</h1>

        <p className="text-muted-foreground text-base leading-7 sm:text-lg">
          서비스 애플리케이션이 준비되었습니다. 콘텐츠 목록, 인증, 관리자 기능을 샘플 기능으로
          확장할 수 있습니다.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={URLS.CLIENT.CONTENTS}
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        >
          콘텐츠 보기
        </Link>

        <Link
          href={URLS.CLIENT.LOGIN}
          className="hover:bg-muted rounded-md border border-(--color-border) px-4 py-2 text-sm font-medium transition-colors"
        >
          로그인
        </Link>
      </div>
    </section>
  );
}
