import { LoginView } from "@/views/LoginView";

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

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;

  return <LoginView error={getSearchParamValue(resolvedSearchParams.error)} />;
}
