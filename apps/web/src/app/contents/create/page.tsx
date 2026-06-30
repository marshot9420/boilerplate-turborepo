import type { Metadata } from "next";

import { requireUser } from "@repo/auth/server";

import { CreateContentView } from "@/views/create-content-view";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "콘텐츠 작성",
  description: "새로운 콘텐츠를 작성합니다.",
};

export default async function CreateContentPage() {
  await requireUser();

  return <CreateContentView />;
}
