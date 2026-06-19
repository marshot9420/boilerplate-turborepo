import { Alert, AlertDescription, AlertTitle } from "@repo/design-system/admin";

interface LoginErrorMessage {
  title: string;
  description: string;
}

const DEFAULT_LOGIN_ERROR_MESSAGE = {
  title: "로그인에 실패했습니다.",
  description: "로그인 정보를 확인한 뒤 다시 시도해 주세요.",
} satisfies LoginErrorMessage;

const LOGIN_ERROR_MESSAGES = {
  invalid_oauth_provider: {
    title: "지원하지 않는 로그인 방식입니다.",
    description: "다른 로그인 방식을 선택해 주세요.",
  },
  oauth_state_invalid: {
    title: "로그인 요청이 만료되었습니다.",
    description: "로그인 페이지에서 다시 시도해 주세요.",
  },
  oauth_callback_failed: {
    title: "OAuth 인증을 완료하지 못했습니다.",
    description: "잠시 후 다시 시도해 주세요.",
  },
  oauth_user_blocked: {
    title: "사용할 수 없는 계정입니다.",
    description: "계정 상태를 확인한 뒤 다시 시도해 주세요.",
  },
  unauthorized: {
    title: "로그인이 필요합니다.",
    description: "관리자 페이지에 접근하려면 먼저 로그인해 주세요.",
  },
  forbidden: {
    title: "관리자 권한이 필요합니다.",
    description: "관리자 권한이 있는 계정으로 다시 로그인해 주세요.",
  },
  admin_required: {
    title: "관리자 권한이 필요합니다.",
    description: "관리자 권한이 있는 계정으로 다시 로그인해 주세요.",
  },
  internal_server_error: {
    title: "로그인 처리 중 오류가 발생했습니다.",
    description: "잠시 후 다시 시도해 주세요.",
  },
} satisfies Record<string, LoginErrorMessage>;

type LoginErrorCode = keyof typeof LOGIN_ERROR_MESSAGES;

export interface LoginErrorAlertProps {
  error?: string;
  className?: string;
}

function isLoginErrorCode(error: string): error is LoginErrorCode {
  return error in LOGIN_ERROR_MESSAGES;
}

function getLoginErrorMessage(error: string): LoginErrorMessage {
  if (isLoginErrorCode(error)) {
    return LOGIN_ERROR_MESSAGES[error];
  }

  return DEFAULT_LOGIN_ERROR_MESSAGE;
}

export default function LoginErrorAlert({ error, className }: LoginErrorAlertProps) {
  if (!error) {
    return null;
  }

  const message = getLoginErrorMessage(error);

  return (
    <Alert tone="danger" role="alert" className={className}>
      <AlertTitle>{message.title}</AlertTitle>
      <AlertDescription>{message.description}</AlertDescription>
    </Alert>
  );
}
