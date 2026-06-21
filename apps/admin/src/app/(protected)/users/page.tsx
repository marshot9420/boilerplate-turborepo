import { requireAdmin } from "@repo/auth/server";

export const runtime = "nodejs";

export default async function UsersPage() {
  await requireAdmin();

  return <div>UsersPage</div>;
}
