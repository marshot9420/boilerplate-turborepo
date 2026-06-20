import { Card, Separator } from "@repo/design-system/admin";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import { DeleteContentForm, type DeleteContentFormAction } from "../delete-content-form";
import {
  UpdateContentStatusForm,
  type UpdateContentStatusFormAction,
} from "../update-content-status-form";

export interface ContentAdminActionsProps {
  content: ContentDetailResponse;
  updateStatusAction: UpdateContentStatusFormAction;
  deleteAction: DeleteContentFormAction;
}

export default function ContentAdminActions({
  content,
  updateStatusAction,
  deleteAction,
}: ContentAdminActionsProps) {
  const deleted = content.status === "DELETED";

  return (
    <Card className="space-y-6 p-6">
      <div className="space-y-1">
        <h2 className="text-foreground text-lg font-semibold">관리 작업</h2>
        <p className="text-muted-foreground text-sm">
          콘텐츠 상태를 변경하거나 삭제 상태로 전환합니다.
        </p>
      </div>

      <Separator />

      <UpdateContentStatusForm
        contentId={content.id}
        currentStatus={content.status}
        action={updateStatusAction}
      />

      <Separator />

      <DeleteContentForm
        contentId={content.id}
        contentTitle={content.title}
        disabled={deleted}
        action={deleteAction}
      />
    </Card>
  );
}
