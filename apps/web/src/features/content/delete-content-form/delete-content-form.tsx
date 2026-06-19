"use client";

import { useRouter } from "next/navigation";

import { useActionState, useEffect } from "react";

import type { ActionResult } from "@repo/core/action";
import { getFormError } from "@repo/design-system/form";
import { toastActionResult } from "@repo/design-system/toast";
import { Alert, AlertDescription } from "@repo/design-system/web";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import { DeleteContentSubmitButton } from "../delete-content-submit-button";

export type DeleteContentFormState = ActionResult<ContentDetailResponse> | null;

export type DeleteContentFormAction = (
  prevState: DeleteContentFormState,
  formData: FormData,
) => Promise<ActionResult<ContentDetailResponse>>;

export interface DeleteContentFormProps {
  contentId: string;
  action: DeleteContentFormAction;
  initialState?: DeleteContentFormState;
  successHref?: string;
  confirmMessage?: string;
  className?: string;
  buttonClassName?: string;
}

export default function DeleteContentForm({
  contentId,
  action,
  initialState = null,
  successHref,
  confirmMessage = "정말 이 콘텐츠를 삭제하시겠습니까?",
  className,
  buttonClassName,
}: DeleteContentFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, initialState);

  const formError = getFormError(state);

  useEffect(() => {
    if (!state) {
      return;
    }

    toastActionResult(state);

    if (state.ok && successHref) {
      router.replace(successHref);
    }
  }, [router, state, successHref]);

  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(event) => {
        if (!confirmMessage) {
          return;
        }

        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={contentId} />

      {formError ? (
        <Alert tone="danger" role="alert" className="mb-3">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <DeleteContentSubmitButton size="sm" className={buttonClassName} />
    </form>
  );
}
