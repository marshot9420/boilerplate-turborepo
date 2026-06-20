import { Button, Input, LinkButton, Select } from "@repo/design-system/admin";

import { URLS } from "@/constants";

type ContentFilterValue = string | string[] | undefined;

export interface ContentFilterFormValues {
  status?: ContentFilterValue;
  authorId?: ContentFilterValue;
  limit?: ContentFilterValue;
}

export interface ContentFilterFormProps {
  defaultValues?: ContentFilterFormValues;
}

function getDefaultValue(value: ContentFilterValue) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default function ContentFilterForm({ defaultValues }: ContentFilterFormProps) {
  const defaultStatus = getDefaultValue(defaultValues?.status);
  const defaultAuthorId = getDefaultValue(defaultValues?.authorId);
  const defaultLimit = getDefaultValue(defaultValues?.limit) || "20";

  return (
    <form
      action={URLS.CLIENT.CONTENTS}
      method="get"
      className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]"
    >
      <div className="grid gap-1.5">
        <label htmlFor="content-status" className="text-muted-foreground text-xs font-medium">
          상태
        </label>

        <Select id="content-status" name="status" defaultValue={defaultStatus}>
          <option value="">전체</option>
          <option value="PUBLISHED">공개</option>
          <option value="HIDDEN">숨김</option>
          <option value="DELETED">삭제됨</option>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="content-author-id" className="text-muted-foreground text-xs font-medium">
          작성자 ID
        </label>

        <Input
          id="content-author-id"
          name="authorId"
          defaultValue={defaultAuthorId}
          placeholder="작성자 UUID"
          autoComplete="off"
        />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="content-limit" className="text-muted-foreground text-xs font-medium">
          표시 개수
        </label>

        <Select id="content-limit" name="limit" defaultValue={defaultLimit}>
          <option value="10">10개</option>
          <option value="20">20개</option>
          <option value="50">50개</option>
          <option value="100">100개</option>
        </Select>
      </div>

      <div className="flex items-end gap-2">
        <Button type="submit">조회</Button>

        <LinkButton href={URLS.CLIENT.CONTENTS} variant="outline">
          초기화
        </LinkButton>
      </div>
    </form>
  );
}
