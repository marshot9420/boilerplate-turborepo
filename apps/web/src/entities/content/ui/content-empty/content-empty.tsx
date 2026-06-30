import { EmptyState } from "@repo/design-system/web";

export default function ContentEmpty() {
  return (
    <EmptyState variant="muted" className="py-16">
      <div className="mx-auto max-w-sm space-y-2 text-center">
        <h2 className="text-lg font-semibold tracking-tight">등록된 콘텐츠가 없습니다.</h2>

        <p className="text-muted-foreground text-sm leading-6">
          공개된 콘텐츠가 생기면 이곳에 표시됩니다.
        </p>
      </div>
    </EmptyState>
  );
}
