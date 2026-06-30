"use client";

import { useRouter } from "next/navigation";

import { useActionState, useEffect, useId, useState } from "react";

import type { ActionResult } from "@repo/core/action";
import { getFieldError, getFormError } from "@repo/design-system/form";
import { toastActionResult } from "@repo/design-system/toast";
import {
  Alert,
  AlertDescription,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Separator,
  Textarea,
} from "@repo/design-system/web";
import { CONTENT, type ContentDetailResponse } from "@repo/domain/content/client";

import { UpdateContentSubmitButton } from "../update-content-submit-button";

export type UpdateContentFormState = ActionResult<ContentDetailResponse> | null;

export type UpdateContentFormAction = (
  prevState: UpdateContentFormState,
  formData: FormData,
) => Promise<ActionResult<ContentDetailResponse>>;

export interface UpdateContentFormProps {
  content: ContentDetailResponse;
  action: UpdateContentFormAction;
  initialState?: UpdateContentFormState;
  successHref?: string;
}

function createDescribedBy(...ids: Array<string | false | null | undefined>) {
  const describedBy = ids.filter(Boolean).join(" ");

  return describedBy || undefined;
}

export default function UpdateContentForm({
  content,
  action,
  initialState = null,
  successHref,
}: UpdateContentFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, initialState);

  const titleId = useId();
  const titleCounterId = useId();
  const titleDescriptionId = useId();
  const titleErrorId = useId();

  const contentId = useId();
  const contentCounterId = useId();
  const contentDescriptionId = useId();
  const contentErrorId = useId();

  const [titleLength, setTitleLength] = useState(content.title.length);
  const [contentLength, setContentLength] = useState(content.content.length);

  const titleError = getFieldError(state, "title");
  const bodyError = getFieldError(state, "content");
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
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={content.id} />

      {formError ? (
        <Alert tone="danger" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <Field>
        <div className="flex items-end justify-between gap-3">
          <FieldLabel htmlFor={titleId}>제목</FieldLabel>

          <FieldDescription id={titleCounterId} size="sm" className="shrink-0 tabular-nums">
            {titleLength}/{CONTENT.TITLE.MAX_LENGTH}
          </FieldDescription>
        </div>

        <Input
          id={titleId}
          name="title"
          type="text"
          required
          maxLength={CONTENT.TITLE.MAX_LENGTH}
          defaultValue={content.title}
          placeholder="콘텐츠 제목을 입력해 주세요."
          aria-invalid={titleError ? true : undefined}
          aria-describedby={createDescribedBy(
            titleCounterId,
            titleDescriptionId,
            titleError && titleErrorId,
          )}
          data-invalid={titleError ? "true" : undefined}
          onChange={(event) => {
            setTitleLength(event.currentTarget.value.length);
          }}
        />

        <FieldDescription id={titleDescriptionId}>
          제목은 {CONTENT.TITLE.MAX_LENGTH}자 이하로 입력해 주세요.
        </FieldDescription>

        {titleError ? <FieldError id={titleErrorId}>{titleError}</FieldError> : null}
      </Field>

      <Field>
        <div className="flex items-end justify-between gap-3">
          <FieldLabel htmlFor={contentId}>본문</FieldLabel>

          <FieldDescription id={contentCounterId} size="sm" className="shrink-0 tabular-nums">
            {contentLength}자
          </FieldDescription>
        </div>

        <Textarea
          id={contentId}
          name="content"
          required
          defaultValue={content.content}
          placeholder="콘텐츠 본문을 입력해 주세요."
          className="min-h-60 resize-y"
          aria-invalid={bodyError ? true : undefined}
          aria-describedby={createDescribedBy(
            contentCounterId,
            contentDescriptionId,
            bodyError && contentErrorId,
          )}
          data-invalid={bodyError ? "true" : undefined}
          onChange={(event) => {
            setContentLength(event.currentTarget.value.length);
          }}
        />

        <FieldDescription id={contentDescriptionId}>
          수정 후 저장하면 기존 콘텐츠에 바로 반영됩니다.
        </FieldDescription>

        {bodyError ? <FieldError id={contentErrorId}>{bodyError}</FieldError> : null}
      </Field>

      <Separator spacing="md" />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <UpdateContentSubmitButton className="w-full sm:w-auto" />
      </div>
    </form>
  );
}
