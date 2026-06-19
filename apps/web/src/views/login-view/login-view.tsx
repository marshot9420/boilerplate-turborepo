import { Alert, AlertDescription, AlertTitle, Card, Separator } from "@repo/design-system/web";

import { SocialLoginButtons } from "@/features/auth";

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  invalid_oauth_provider: "지원하지 않는 로그인 방식입니다.",
  oauth_failed: "소셜 로그인에 실패했습니다. 다시 시도해 주세요.",
  unauthorized: "로그인이 필요한 페이지입니다.",
  session_expired: "로그인 세션이 만료되었습니다. 다시 로그인해 주세요.",
  logout_failed: "로그아웃 처리 중 문제가 발생했습니다.",
};

export interface LoginViewProps {
  error?: string;
}

function getLoginErrorMessage(error: string | undefined) {
  if (!error) {
    return null;
  }

  return LOGIN_ERROR_MESSAGES[error] ?? "로그인 처리 중 문제가 발생했습니다.";
}

export default function LoginView({ error }: LoginViewProps) {
  const errorMessage = getLoginErrorMessage(error);

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
          <p className="text-muted-foreground text-sm">소셜 계정으로 간편하게 로그인하세요.</p>
        </div>

        {errorMessage ? (
          <Alert tone="danger" role="alert" className="mt-6">
            <AlertTitle>로그인 실패</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <Separator spacing="lg" />

        <SocialLoginButtons />

        <p className="text-muted-foreground mt-6 text-center text-xs leading-relaxed">
          로그인하면 서비스 이용을 위한 기본 계정 정보가 생성됩니다.
        </p>
      </Card>
    </main>
  );
}
