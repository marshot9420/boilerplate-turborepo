export function getSearchParam(
  searchParams: URLSearchParams,
  key: string,
): string | undefined {
  const value = searchParams.get(key);

  if (!value) {
    return undefined;
  }

  return value;
}

export function getNumberSearchParam(
  searchParams: URLSearchParams,
  key: string,
): number | undefined {
  const value = getSearchParam(searchParams, key);

  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return parsed;
}
