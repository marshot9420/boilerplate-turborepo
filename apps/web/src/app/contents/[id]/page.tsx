import { ContentDetailView } from "@/views/content-detail-view";

export const runtime = "nodejs";

interface ContentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContentDetailPage({ params }: ContentDetailPageProps) {
  const { id } = await params;

  return <ContentDetailView contentId={id} />;
}
