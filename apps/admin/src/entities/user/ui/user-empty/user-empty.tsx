import type { HTMLAttributes } from "react";

import { EmptyState } from "@repo/design-system/admin";

export interface UserEmptyProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export default function UserEmpty({
  title = "조회된 사용자가 없습니다.",
  description = "검색어나 필터 조건을 변경해서 다시 조회해 보세요.",
  className,
  ...props
}: UserEmptyProps) {
  return (
    <EmptyState
      variant="surface"
      className={["border-border min-h-52 rounded-lg border px-6 py-10", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      </div>
    </EmptyState>
  );
}
