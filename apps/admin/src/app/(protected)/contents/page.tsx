import { getContentsAction } from "@/actions/content";
import { ContentListView } from "@/views";

interface ContentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ContentsPage({ searchParams }: ContentsPageProps) {
  const resolvedSearchParams = await searchParams;
  const result = await getContentsAction(resolvedSearchParams);

  return <ContentListView result={result} searchParams={resolvedSearchParams} />;
}
