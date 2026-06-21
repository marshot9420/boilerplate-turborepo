import { Button, Input, LinkButton, Select } from "@repo/design-system/admin";
import type { UserListQueryInput } from "@repo/domain/user/client";

export interface UserFilterFormProps {
  action: string;
  query?: UserListQueryInput;
}

export default function UserFilterForm({ action, query }: UserFilterFormProps) {
  return (
    <form action={action} method="get" className="border-border bg-surface rounded-lg border p-4">
      {query?.sortKey ? <input type="hidden" name="sortKey" value={query.sortKey} /> : null}
      {query?.sortDirection ? (
        <input type="hidden" name="sortDirection" value={query.sortDirection} />
      ) : null}
      {query?.limit ? <input type="hidden" name="limit" value={query.limit} /> : null}

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_10rem_auto_auto] md:items-end">
        <label className="grid gap-1.5">
          <span className="text-muted-foreground text-xs font-medium">검색어</span>
          <Input
            name="keyword"
            defaultValue={query?.keyword ?? ""}
            placeholder="이메일, 이름, 닉네임 검색"
            autoComplete="off"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-muted-foreground text-xs font-medium">권한</span>
          <Select name="role" defaultValue={query?.role ?? ""}>
            <option value="">전체</option>
            <option value="USER">일반 사용자</option>
            <option value="ADMIN">관리자</option>
          </Select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-muted-foreground text-xs font-medium">상태</span>
          <Select name="status" defaultValue={query?.status ?? ""}>
            <option value="">전체</option>
            <option value="ACTIVE">활성</option>
            <option value="SUSPENDED">정지</option>
            <option value="BANNED">차단</option>
            <option value="DELETED">삭제</option>
          </Select>
        </label>

        <Button type="submit">조회</Button>

        <LinkButton href={action} variant="outline">
          초기화
        </LinkButton>
      </div>
    </form>
  );
}
