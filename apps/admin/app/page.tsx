import { redirect } from "next/navigation";

import { AUTH_ERROR_CODE, requireAdmin } from "@repo/auth/server";

import { URLS } from "@/constants";

function isAuthError(error: unknown): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}

async function getRequiredAdminSession() {
  try {
    return await requireAdmin();
  } catch (error) {
    if (isAuthError(error) && error.code === AUTH_ERROR_CODE.FORBIDDEN) {
      redirect(`${URLS.CLIENT.LOGIN}?error=forbidden`);
    }

    redirect(`${URLS.CLIENT.LOGIN}?error=unauthorized`);
  }
}

export default async function AdminHomePage() {
  const session = await getRequiredAdminSession();

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
      <section className="mx-auto max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">관리자 홈</h1>
          <p className="mt-2 text-sm text-zinc-400">
            관리자 권한이 확인된 사용자만 접근할 수 있습니다.
          </p>
        </div>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-zinc-400">관리자 ID</dt>
            <dd className="mt-1 text-white">{session.user.id}</dd>
          </div>

          <div>
            <dt className="font-medium text-zinc-400">이메일</dt>
            <dd className="mt-1 text-white">{session.user.email}</dd>
          </div>

          <div>
            <dt className="font-medium text-zinc-400">닉네임</dt>
            <dd className="mt-1 text-white">{session.user.nickname}</dd>
          </div>

          <div>
            <dt className="font-medium text-zinc-400">권한</dt>
            <dd className="mt-1 text-white">{session.user.role}</dd>
          </div>
        </dl>

        <form action="/api/auth/logout" method="post" className="mt-8">
          <button
            type="submit"
            className="h-10 rounded-md bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            로그아웃
          </button>
        </form>
      </section>
    </main>
  );
}
