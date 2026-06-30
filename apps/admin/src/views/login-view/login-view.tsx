import { SocialLoginButtons } from "@/features/auth";
import { AuthCard, AuthLayout, LoginErrorAlert } from "@/shared";

export interface LoginViewProps {
  error?: string;
}

export default function LoginView({ error }: LoginViewProps) {
  return (
    <AuthLayout>
      <AuthCard
        title="관리자 로그인"
        description="관리자 권한이 있는 계정으로 로그인해 주세요."
        footer={
          <p className="text-muted-foreground text-center text-xs leading-5">
            권한이 없는 계정으로 로그인하면 관리자 페이지에 접근할 수 없습니다.
          </p>
        }
      >
        <div className="space-y-4">
          <LoginErrorAlert error={error} />

          <SocialLoginButtons />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
