import { ContentListView } from "@/views/content-list-view";

interface ContentsPageProps {
  searchParams: Promise<{
    page?: string | string[];
    limit?: string | string[];
  }>;
}

function getNumberSearchParam(value: string | string[] | undefined) {
  if (!value || Array.isArray(value)) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return undefined;
  }

  return parsed;
}

export default async function ContentsPage({ searchParams }: ContentsPageProps) {
  const params = await searchParams;

  return (
    <ContentListView
      page={getNumberSearchParam(params.page)}
      limit={getNumberSearchParam(params.limit)}
    />
  );
}
