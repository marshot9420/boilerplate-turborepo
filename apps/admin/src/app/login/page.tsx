import type { Metadata } from "next";

import { LoginView } from "@/views/login-view";

export const metadata: Metadata = {
  title: "관리자 로그인",
  description: "관리자 페이지 로그인",
};

type LoginPageSearchParams = Promise<{
  error?: string | string[];
}>;

interface LoginPageProps {
  searchParams?: LoginPageSearchParams;
}

function getSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const error = getSearchParamValue(resolvedSearchParams?.error);

  return <LoginView error={error} />;
}
