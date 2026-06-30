"use client";

import { useRouter } from "next/navigation";

import { useActionState, useEffect, useId, useRef, useState } from "react";

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

import { CreateContentSubmitButton } from "../create-content-submit-button";

export type CreateContentFormState = ActionResult<ContentDetailResponse> | null;

export type CreateContentFormAction = (
  prevState: CreateContentFormState,
  formData: FormData,
) => Promise<ActionResult<ContentDetailResponse>>;

export interface CreateContentFormProps {
  action: CreateContentFormAction;
  initialState?: CreateContentFormState;

  /**
   * 성공 후 고정 경로로 이동할 때 사용합니다.
   * 예: "/contents"
   */
  successHref?: string;

  /**
   * 성공 후 생성된 콘텐츠 상세 페이지로 이동할 때 사용합니다.
   * 예: "/contents" -> "/contents/{createdContentId}"
   */
  createdContentHrefPrefix?: string;
}

function createDescribedBy(...ids: Array<string | false | null | undefined>) {
  const describedBy = ids.filter(Boolean).join(" ");

  return describedBy || undefined;
}

function joinPath(pathname: string, segment: string) {
  const normalizedPathname = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  return `${normalizedPathname}/${segment}`;
}

function resolveSuccessHref(params: {
  successHref: string | undefined;
  createdContentHrefPrefix: string | undefined;
  content: ContentDetailResponse;
}) {
  if (params.successHref) {
    return params.successHref;
  }

  if (params.createdContentHrefPrefix) {
    return joinPath(params.createdContentHrefPrefix, params.content.id);
  }

  return undefined;
}

export default function CreateContentForm({
  action,
  initialState = null,
  successHref,
  createdContentHrefPrefix,
}: CreateContentFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, initialState);

  const formRef = useRef<HTMLFormElement>(null);

  const titleId = useId();
  const titleCounterId = useId();
  const titleDescriptionId = useId();
  const titleErrorId = useId();

  const contentId = useId();
  const contentCounterId = useId();
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

    if (!state.ok) {
      return;
    }

    formRef.current?.reset();
    setTitleLength(0);
    setContentLength(0);

    const resolvedSuccessHref = resolveSuccessHref({
      successHref,
      createdContentHrefPrefix,
      content: state.data,
    });

    if (resolvedSuccessHref) {
      router.replace(resolvedSuccessHref);
    }
  }, [createdContentHrefPrefix, router, state, successHref]);

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
          placeholder="콘텐츠 본문을 입력해 주세요."
          className="min-h-60 resize-y"
          aria-invalid={contentError ? true : undefined}
          aria-describedby={createDescribedBy(
            contentCounterId,
            contentDescriptionId,
            contentError && contentErrorId,
          )}
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
