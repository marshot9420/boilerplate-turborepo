"use client";

import { useRouter } from "next/navigation";

import { useActionState, useEffect, useId, useState } from "react";

import type { ActionResult } from "@repo/core/action";
import { getFieldError, getFormError, hasFieldError } from "@repo/design-system/form";
import { toastActionResult } from "@repo/design-system/toast";
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
  LinkButton,
  Separator,
} from "@repo/design-system/web";
import { USER, type UserDetailResponse } from "@repo/domain/user/client";

import { URLS } from "@/constants";
import { UpdateMyProfileSubmitButton } from "@/features/user/update-my-profile-submit-button";

export type UpdateMyProfileFormAction = (
  prevState: ActionResult<UserDetailResponse> | null,
  formData: FormData,
) => Promise<ActionResult<UserDetailResponse>>;

export interface UpdateMyProfileFormProps {
  user: UserDetailResponse;
  action: UpdateMyProfileFormAction;
  className?: string;
}

export default function UpdateMyProfileForm({ user, action, className }: UpdateMyProfileFormProps) {
  const id = useId();
  const router = useRouter();

  const [state, formAction] = useActionState(action, null);

  const [name, setName] = useState(user.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
  const [nickname, setNickname] = useState(user.nickname);

  const nameId = `${id}-name`;
  const nameDescriptionId = `${id}-name-description`;
  const nameErrorId = `${id}-name-error`;

  const avatarUrlId = `${id}-avatar-url`;
  const avatarUrlDescriptionId = `${id}-avatar-url-description`;
  const avatarUrlErrorId = `${id}-avatar-url-error`;

  const nicknameId = `${id}-nickname`;
  const nicknameDescriptionId = `${id}-nickname-description`;
  const nicknameErrorId = `${id}-nickname-error`;

  const formError = getFormError(state);

  const nameError = getFieldError(state, "name");
  const avatarUrlError = getFieldError(state, "avatarUrl");
  const nicknameError = getFieldError(state, "nickname");

  useEffect(() => {
    toastActionResult(state);

    if (state?.ok) {
      router.replace(URLS.CLIENT.MY_PAGE);
      router.refresh();
    }
  }, [router, state]);

  return (
    <Card className={className}>
      <form action={formAction} className="flex flex-col gap-6 p-5 sm:p-6">
        {formError ? (
          <Alert tone="danger">
            <AlertTitle>프로필을 수정할 수 없습니다.</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-5">
          <Field>
            <div className="flex items-center justify-between gap-4">
              <FieldLabel htmlFor={nicknameId}>닉네임</FieldLabel>

              <span className="text-muted-foreground text-xs tabular-nums">
                {nickname.length}/{USER.NICKNAME.MAX_LENGTH}
              </span>
            </div>

            <Input
              id={nicknameId}
              name="nickname"
              value={nickname}
              minLength={USER.NICKNAME.MIN_LENGTH}
              maxLength={USER.NICKNAME.MAX_LENGTH}
              pattern={USER.NICKNAME.PATTERN.source}
              required
              hasError={hasFieldError(state, "nickname")}
              aria-describedby={
                nicknameError
                  ? `${nicknameDescriptionId} ${nicknameErrorId}`
                  : nicknameDescriptionId
              }
              onChange={(event) => setNickname(event.target.value)}
            />

            <FieldDescription id={nicknameDescriptionId}>
              한글, 영문, 숫자, 밑줄만 사용할 수 있습니다.
            </FieldDescription>

            {nicknameError ? <FieldError id={nicknameErrorId}>{nicknameError}</FieldError> : null}
          </Field>

          <Field>
            <div className="flex items-center justify-between gap-4">
              <FieldLabel htmlFor={nameId}>이름</FieldLabel>

              <span className="text-muted-foreground text-xs tabular-nums">
                {name.length}/{USER.NAME.MAX_LENGTH}
              </span>
            </div>

            <Input
              id={nameId}
              name="name"
              value={name}
              maxLength={USER.NAME.MAX_LENGTH}
              hasError={hasFieldError(state, "name")}
              aria-describedby={
                nameError ? `${nameDescriptionId} ${nameErrorId}` : nameDescriptionId
              }
              onChange={(event) => setName(event.target.value)}
            />

            <FieldDescription id={nameDescriptionId}>
              이름을 비워두면 프로필에서 이름이 없음으로 표시됩니다.
            </FieldDescription>

            {nameError ? <FieldError id={nameErrorId}>{nameError}</FieldError> : null}
          </Field>

          <Field>
            <FieldLabel htmlFor={avatarUrlId}>프로필 이미지 URL</FieldLabel>

            <Input
              id={avatarUrlId}
              name="avatarUrl"
              type="url"
              value={avatarUrl}
              placeholder="https://example.com/avatar.png"
              hasError={hasFieldError(state, "avatarUrl")}
              aria-describedby={
                avatarUrlError
                  ? `${avatarUrlDescriptionId} ${avatarUrlErrorId}`
                  : avatarUrlDescriptionId
              }
              onChange={(event) => setAvatarUrl(event.target.value)}
            />

            <FieldDescription id={avatarUrlDescriptionId}>
              이미지 URL을 비워두면 닉네임 첫 글자가 기본 이미지로 표시됩니다.
            </FieldDescription>

            {avatarUrlError ? (
              <FieldError id={avatarUrlErrorId}>{avatarUrlError}</FieldError>
            ) : null}
          </Field>
        </div>

        <Separator spacing="none" />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <LinkButton href={URLS.CLIENT.MY_PAGE} variant="outline">
            취소
          </LinkButton>

          <UpdateMyProfileSubmitButton />
        </div>
      </form>
    </Card>
  );
}
