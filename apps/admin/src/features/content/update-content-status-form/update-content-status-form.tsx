"use client";

import { useRouter } from "next/navigation";

import { useActionState, useEffect } from "react";

import type { ActionResult } from "@repo/core/action";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Field,
  FieldError,
  FieldLabel,
  Select,
} from "@repo/design-system/admin";
import { getFieldError, getFormError } from "@repo/design-system/form";
import { toastActionResult } from "@repo/design-system/toast";
import type { ContentDetailResponse, ContentStatus } from "@repo/domain/content/client";

export type UpdateContentStatusFormAction = (
  prevState: ActionResult<ContentDetailResponse> | null,
  formData: FormData,
) => Promise<ActionResult<ContentDetailResponse>>;

export interface UpdateContentStatusFormProps {
  contentId: string;
  currentStatus: ContentStatus;
  action: UpdateContentStatusFormAction;
}

const initialState: ActionResult<ContentDetailResponse> | null = null;

export default function UpdateContentStatusForm({
  contentId,
  currentStatus,
  action,
}: UpdateContentStatusFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);

  const formError = getFormError(state);
  const idError = getFieldError(state, "id");
  const statusError = getFieldError(state, "status");
  const disabled = currentStatus === "DELETED";

  useEffect(() => {
    if (!state) {
      return;
    }

    toastActionResult(state);

    if (state.ok) {
      router.refresh();
    }
  }, [router, state]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={contentId} />

      <div className="space-y-1">
        <h3 className="text-foreground text-base font-semibold">상태 변경</h3>
        <p className="text-muted-foreground text-sm">
          콘텐츠 공개 여부를 관리자 권한으로 변경합니다.
        </p>
      </div>

      {disabled ? (
        <Alert tone="warning">
          <AlertTitle>상태 변경 불가</AlertTitle>
          <AlertDescription>삭제된 콘텐츠는 상태를 변경할 수 없습니다.</AlertDescription>
        </Alert>
      ) : null}

      {formError ? (
        <Alert tone="danger">
          <AlertTitle>상태 변경 실패</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <Field>
        <FieldLabel htmlFor="content-status" size="sm" weight="semibold">
          상태
        </FieldLabel>

        <Select
          id="content-status"
          name="status"
          defaultValue={currentStatus}
          disabled={disabled || pending}
          aria-invalid={statusError ? true : undefined}
          aria-describedby={statusError ? "content-status-error" : undefined}
        >
          {currentStatus === "DELETED" ? <option value="DELETED">삭제됨</option> : null}
          <option value="PUBLISHED">공개</option>
          <option value="HIDDEN">숨김</option>
        </Select>

        {statusError ? <FieldError id="content-status-error">{statusError}</FieldError> : null}
      </Field>

      {idError ? <FieldError>{idError}</FieldError> : null}

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={disabled || pending}>
          {pending ? "변경 중..." : "상태 변경"}
        </Button>
      </div>
    </form>
  );
}
