import { URLS } from "@/constants";

import { LogoutSubmitButton, type LogoutSubmitButtonProps } from "../logout-submit-button";

export interface LogoutButtonProps extends LogoutSubmitButtonProps {
  formClassName?: string;
  formAriaLabel?: string;
}

export default function LogoutButton({
  formClassName,
  formAriaLabel = "로그아웃",
  ...buttonProps
}: LogoutButtonProps) {
  return (
    <form
      action={URLS.API.AUTH.LOGOUT}
      method="post"
      aria-label={formAriaLabel}
      className={formClassName}
    >
      <LogoutSubmitButton {...buttonProps} />
    </form>
  );
}
