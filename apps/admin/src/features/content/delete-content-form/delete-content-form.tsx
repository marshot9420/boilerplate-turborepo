"use client";

import { useRouter } from "next/navigation";

import { useActionState, useEffect } from "react";

import type { ActionResult } from "@repo/core/action";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  ConfirmDialog,
  ConfirmDialogAction,
  ConfirmDialogCancel,
  ConfirmDialogContent,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
  ConfirmDialogTrigger,
  FieldError,
} from "@repo/design-system/admin";
import { getFieldError, getFormError } from "@repo/design-system/form";
import { toastActionResult } from "@repo/design-system/toast";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

export type DeleteContentFormAction = (
  prevState: ActionResult<ContentDetailResponse> | null,
  formData: FormData,
) => Promise<ActionResult<ContentDetailResponse>>;

export interface DeleteContentFormProps {
  contentId: string;
  action: DeleteContentFormAction;
  contentTitle?: string;
  disabled?: boolean;
}

const initialState: ActionResult<ContentDetailResponse> | null = null;

export default function DeleteContentForm({
  contentId,
  action,
  contentTitle,
  disabled = false,
}: DeleteContentFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);

  const formError = getFormError(state);
  const idError = getFieldError(state, "id");

  useEffect(() => {
    if (!state) {
      return;
    }

    toastActionResult(state);

    if (state.ok) {
      router.replace(URLS.CLIENT.CONTENTS);
      router.refresh();
    }
  }, [router, state]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-foreground text-base font-semibold">콘텐츠 삭제</h3>
        <p className="text-muted-foreground text-sm">
          콘텐츠를 삭제 상태로 변경합니다. 삭제된 콘텐츠는 일반 사용자에게 노출되지 않습니다.
        </p>
      </div>

      {disabled ? (
        <Alert tone="warning">
          <AlertTitle>이미 삭제된 콘텐츠</AlertTitle>
          <AlertDescription>이미 삭제된 콘텐츠는 다시 삭제할 수 없습니다.</AlertDescription>
        </Alert>
      ) : null}

      {formError ? (
        <Alert tone="danger">
          <AlertTitle>삭제 실패</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      {idError ? <FieldError>{idError}</FieldError> : null}

      <ConfirmDialog>
        <ConfirmDialogTrigger asChild>
          <Button type="button" variant="destructive" size="sm" disabled={disabled || pending}>
            콘텐츠 삭제
          </Button>
        </ConfirmDialogTrigger>

        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>콘텐츠를 삭제할까요?</ConfirmDialogTitle>
            <ConfirmDialogDescription>
              {contentTitle ? `「${contentTitle}」 콘텐츠를 삭제 상태로 변경합니다. ` : null}이 작업
              후 콘텐츠는 일반 사용자에게 노출되지 않습니다.
            </ConfirmDialogDescription>
          </ConfirmDialogHeader>

          <form action={formAction}>
            <input type="hidden" name="id" value={contentId} />

            <ConfirmDialogFooter>
              <ConfirmDialogCancel type="button" disabled={pending}>
                취소
              </ConfirmDialogCancel>

              <ConfirmDialogAction
                type="submit"
                tone="danger"
                loading={pending}
                loadingText="삭제 중..."
              >
                삭제
              </ConfirmDialogAction>
            </ConfirmDialogFooter>
          </form>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </div>
  );
}
