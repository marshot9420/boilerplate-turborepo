import { redirect } from "next/navigation";

import { getCurrentAuthSession } from "@repo/auth/server";

import { URLS } from "@/constants";
import { LoginView } from "@/views/login-view";

interface LoginPageProps {
  searchParams: Promise<{
    error?: string | string[];
  }>;
}

function getSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

async function getLoginPageSession() {
  try {
    return await getCurrentAuthSession();
  } catch {
    return null;
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getLoginPageSession();

  if (session) {
    redirect(URLS.CLIENT.MY_PAGE);
  }

  const resolvedSearchParams = await searchParams;

  return <LoginView error={getSearchParamValue(resolvedSearchParams.error)} />;
}
