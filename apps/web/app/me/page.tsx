import { redirect } from "next/navigation";

import { requireUser } from "@repo/auth/server";

import { URLS } from "@/constants";

async function getRequiredUserSession() {
  try {
    return await requireUser();
  } catch {
    redirect(URLS.CLIENT.LOGIN);
  }
}

export default async function MyPage() {
  const session = await getRequiredUserSession();

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <section className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-950">내 프로필</h1>
          <p className="mt-2 text-sm text-zinc-500">
            현재 로그인된 사용자 정보입니다.
          </p>
        </div>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-zinc-500">사용자 ID</dt>
            <dd className="mt-1 text-zinc-950">{session.user.id}</dd>
          </div>

          <div>
            <dt className="font-medium text-zinc-500">이메일</dt>
            <dd className="mt-1 text-zinc-950">{session.user.email}</dd>
          </div>

          <div>
            <dt className="font-medium text-zinc-500">닉네임</dt>
            <dd className="mt-1 text-zinc-950">{session.user.nickname}</dd>
          </div>

          <div>
            <dt className="font-medium text-zinc-500">권한</dt>
            <dd className="mt-1 text-zinc-950">{session.user.role}</dd>
          </div>

          <div>
            <dt className="font-medium text-zinc-500">상태</dt>
            <dd className="mt-1 text-zinc-950">{session.user.status}</dd>
          </div>
        </dl>

        <form action="/api/auth/logout" method="post" className="mt-8">
          <button
            type="submit"
            className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            로그아웃
          </button>
        </form>
      </section>
    </main>
  );
}
