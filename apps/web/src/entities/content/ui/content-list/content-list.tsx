import type { ContentResponse } from "@repo/domain/content/client";

import { ContentCard } from "../content-card";
import { ContentEmpty } from "../content-empty";

interface ContentListProps {
  contents: ContentResponse[];
}

export default function ContentList({ contents }: ContentListProps) {
  if (contents.length === 0) {
    return <ContentEmpty />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}
