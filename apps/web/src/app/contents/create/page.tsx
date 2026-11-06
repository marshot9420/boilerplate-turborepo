import type { Metadata } from "next";

import { requirePageUser } from "@/shared/auth";
import { CreateContentView } from "@/views/create-content-view";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "콘텐츠 작성",
  description: "새로운 콘텐츠를 작성합니다.",
};

export default async function CreateContentPage() {
  await requirePageUser();

  return <CreateContentView />;
}
