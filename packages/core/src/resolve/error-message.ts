const DEFAULT_ERROR_MESSAGE = "알 수 없는 오류가 발생했습니다.";

export function resolveErrorMessage(
  error: unknown,
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
): string {
  if (error instanceof Error) {
    const message = error.message.trim();

    if (message) {
      return message;
    }
  }

  if (typeof error === "string") {
    const message = error.trim();

    if (message) {
      return message;
    }
  }

  return fallbackMessage;
}
