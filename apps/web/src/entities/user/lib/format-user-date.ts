const userDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatUserDate(value: string | null): string {
  if (!value) {
    return "없음";
  }

  return userDateFormatter.format(new Date(value));
}
