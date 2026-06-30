import { EmptyState } from "@repo/design-system/admin";

export interface ContentEmptyProps {
  filtered?: boolean;
}

export default function ContentEmpty({ filtered = false }: ContentEmptyProps) {
  return (
    <EmptyState
      variant="surface"
      className="border-border rounded-lg border px-6 py-14 text-center"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-2">
        <h2 className="text-foreground text-base font-semibold">
          {filtered ? "조건에 맞는 콘텐츠가 없습니다." : "등록된 콘텐츠가 없습니다."}
        </h2>

        <p className="text-muted-foreground text-sm">
          {filtered
            ? "검색 조건을 변경한 뒤 다시 확인해 주세요."
            : "콘텐츠가 생성되면 이곳에서 관리할 수 있습니다."}
        </p>
      </div>
    </EmptyState>
  );
}
