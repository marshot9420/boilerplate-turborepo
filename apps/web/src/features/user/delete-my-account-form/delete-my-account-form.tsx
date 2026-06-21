"use client";

import { useActionState, useId, useState } from "react";

import type { ActionResult } from "@repo/core/action";
import { getFieldError } from "@repo/design-system/form";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
} from "@repo/design-system/web";

import { DeleteMyAccountSubmitButton } from "../delete-my-account-submit-button";

const DELETE_CONFIRMATION_TEXT = "회원탈퇴";

export type DeleteMyAccountFormAction = (
  prevState: ActionResult<unknown> | null,
  formData: FormData,
) => Promise<ActionResult<unknown>>;

export interface DeleteMyAccountFormProps {
  action: DeleteMyAccountFormAction;
}

export default function DeleteMyAccountForm({ action }: DeleteMyAccountFormProps) {
  const confirmationId = useId();
  const confirmationDescriptionId = useId();
  const confirmationErrorId = useId();

  const [confirmation, setConfirmation] = useState("");
  const [state, formAction] = useActionState<ActionResult<unknown> | null, FormData>(action, null);

  const confirmationError = getFieldError(state, "confirmation");
  const isConfirmed = confirmation.trim() === DELETE_CONFIRMATION_TEXT;

  return (
    <Card variant="outline" className="border-destructive/30 bg-destructive/5 space-y-5 p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-destructive text-sm font-semibold">위험 영역</p>

        <div className="space-y-2">
          <h2 className="text-foreground text-xl font-semibold tracking-tight">회원 탈퇴</h2>

          <p className="text-muted-foreground text-sm leading-6">
            회원 탈퇴를 진행하면 계정이 삭제 처리되고 현재 로그인 세션이 종료됩니다. 이 작업은 일반
            사용자 화면에서 되돌릴 수 없습니다.
          </p>
        </div>
      </div>

      {state && !state.ok ? (
        <Alert tone="danger">
          <AlertTitle>회원 탈퇴를 처리할 수 없습니다.</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <form action={formAction} className="space-y-5">
        <Field>
          <FieldLabel htmlFor={confirmationId}>확인 문구</FieldLabel>

          <FieldDescription id={confirmationDescriptionId}>
            회원 탈퇴를 진행하려면 입력란에{" "}
            <strong className="text-foreground font-semibold">{DELETE_CONFIRMATION_TEXT}</strong>를
            입력해 주세요.
          </FieldDescription>

          <Input
            id={confirmationId}
            name="confirmation"
            value={confirmation}
            onChange={(event) => {
              setConfirmation(event.currentTarget.value);
            }}
            placeholder={DELETE_CONFIRMATION_TEXT}
            autoComplete="off"
            spellCheck={false}
            hasError={Boolean(confirmationError)}
            aria-describedby={
              confirmationError
                ? `${confirmationDescriptionId} ${confirmationErrorId}`
                : confirmationDescriptionId
            }
          />

          {confirmationError ? (
            <FieldError id={confirmationErrorId}>{confirmationError}</FieldError>
          ) : null}
        </Field>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs leading-5">
            탈퇴 후에는 기존 소셜 로그인 계정으로 다시 로그인할 수 없습니다.
          </p>

          <DeleteMyAccountSubmitButton disabled={!isConfirmed} className="w-full sm:w-auto" />
        </div>
      </form>
    </Card>
  );
}
