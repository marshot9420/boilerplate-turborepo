import { SocialLoginButtons } from "@/features/auth";

interface LoginViewProps {
  error?: string;
}

function getLoginErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "invalid_oauth_provider":
      return "지원하지 않는 로그인 방식입니다.";

    case "oauth_failed":
      return "소셜 로그인 처리 중 오류가 발생했습니다.";

    case "unauthorized":
      return "로그인이 필요합니다.";

    default:
      return null;
  }
}

export default function LoginView({ error }: LoginViewProps) {
  const errorMessage = getLoginErrorMessage(error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <section className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-zinc-950">로그인</h1>
          <p className="mt-2 text-sm text-zinc-500">
            소셜 계정으로 서비스를 시작하세요.
          </p>
        </div>

        {errorMessage ? (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorMessage}
          </p>
        ) : null}

        <SocialLoginButtons />
      </section>
    </main>
  );
}
