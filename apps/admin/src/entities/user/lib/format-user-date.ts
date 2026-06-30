const userDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatUserDate(value: string | null) {
  if (!value) {
    return "없음";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "잘못된 날짜";
  }

  return userDateFormatter.format(date);
}
