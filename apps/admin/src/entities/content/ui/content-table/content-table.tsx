import {
  LinkButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/admin";
import type { ContentResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

import { formatContentDate } from "../../lib";
import { ContentStatusBadge } from "../content-status-badge";

export interface ContentTableProps {
  contents: ContentResponse[];
}

export default function ContentTable({ contents }: ContentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[38%]">제목</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>작성자</TableHead>
          <TableHead>생성일</TableHead>
          <TableHead>수정일</TableHead>
          <TableHead className="text-right">관리</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {contents.map((content) => (
          <TableRow key={content.id}>
            <TableCell>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-foreground truncate font-medium">{content.title}</span>
                <span className="text-muted-foreground truncate text-xs">{content.id}</span>
              </div>
            </TableCell>

            <TableCell>
              <ContentStatusBadge status={content.status} />
            </TableCell>

            <TableCell>
              <span className="text-muted-foreground text-sm">{content.authorId}</span>
            </TableCell>

            <TableCell>
              <span className="text-muted-foreground text-sm">
                {formatContentDate(content.createdAt)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-muted-foreground text-sm">
                {formatContentDate(content.updatedAt)}
              </span>
            </TableCell>

            <TableCell className="text-right">
              <LinkButton
                href={`${URLS.CLIENT.CONTENTS}/${content.id}`}
                variant="outline"
                size="sm"
              >
                상세
              </LinkButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
