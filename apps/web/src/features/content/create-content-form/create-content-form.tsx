// apps/web/src/features/content/create-content-form/create-content-form.tsx
"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";

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
import { CONTENT } from "@repo/domain/content/client";

import { createContentAction } from "@/actions/content";

import { CreateContentSubmitButton } from "../create-content-submit-button";

function createDescribedBy(...ids: Array<string | false | null | undefined>) {
  const describedBy = ids.filter(Boolean).join(" ");

  return describedBy || undefined;
}

export default function CreateContentForm() {
  const [state, formAction] = useActionState(createContentAction, null);

  const formRef = useRef<HTMLFormElement>(null);

  const titleId = useId();
  const titleDescriptionId = useId();
  const titleErrorId = useId();

  const contentId = useId();
  const contentDescriptionId = useId();
  const contentErrorId = useId();

  const [titleLength, setTitleLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);

  const titleError = getFieldError(state, "title");
  const contentError = getFieldError(state, "content");
  const formError = getFormError(state);

  useEffect(() => {
    if (!state) {
      return;
    }

    toastActionResult(state);

    if (state.ok) {
      formRef.current?.reset();
      setTitleLength(0);
      setContentLength(0);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {formError ? (
        <Alert tone="danger" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      <Field>
        <div className="flex items-end justify-between gap-3">
          <FieldLabel htmlFor={titleId}>제목</FieldLabel>

          <FieldDescription id={titleDescriptionId} size="sm">
            {titleLength}/{CONTENT.TITLE.MAX_LENGTH}
          </FieldDescription>
        </div>

        <Input
          id={titleId}
          name="title"
          type="text"
          required
          maxLength={CONTENT.TITLE.MAX_LENGTH}
          placeholder="콘텐츠 제목을 입력해 주세요."
          aria-invalid={titleError ? true : undefined}
          aria-describedby={createDescribedBy(titleDescriptionId, titleError && titleErrorId)}
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

          <FieldDescription size="sm">{contentLength}자</FieldDescription>
        </div>

        <Textarea
          id={contentId}
          name="content"
          required
          placeholder="콘텐츠 본문을 입력해 주세요."
          className="min-h-60 resize-y"
          aria-invalid={contentError ? true : undefined}
          aria-describedby={createDescribedBy(contentDescriptionId, contentError && contentErrorId)}
          data-invalid={contentError ? "true" : undefined}
          onChange={(event) => {
            setContentLength(event.currentTarget.value.length);
          }}
        />

        <FieldDescription id={contentDescriptionId}>
          공개 전에도 작성한 콘텐츠는 마이페이지에서 다시 확인할 수 있습니다.
        </FieldDescription>

        {contentError ? <FieldError id={contentErrorId}>{contentError}</FieldError> : null}
      </Field>

      <Separator spacing="md" />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <CreateContentSubmitButton className="w-full sm:w-auto" />
      </div>
    </form>
  );
}
