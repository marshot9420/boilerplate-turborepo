import { Badge } from "@repo/design-system/admin";
import type { ContentStatus } from "@repo/domain/content/client";

import { getContentStatusLabel, getContentStatusTone } from "../../lib";

export interface ContentStatusBadgeProps {
  status: ContentStatus;
}

export default function ContentStatusBadge({ status }: ContentStatusBadgeProps) {
  return <Badge variant={getContentStatusTone(status)}>{getContentStatusLabel(status)}</Badge>;
}
