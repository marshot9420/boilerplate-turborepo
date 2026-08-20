const DEFAULT_LOCALE = "ko-KR";

const DEFAULT_TIME_ZONE = "Asia/Seoul";

export type DateTimeInput = string | number | Date;

export type FormatDateOptions = Intl.DateTimeFormatOptions & {
  locale?: string;
};

function toDate(dateTime: DateTimeInput): Date {
  const date = dateTime instanceof Date ? dateTime : new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    throw new RangeError("Invalid date value.");
  }

  return date;
}

export function formatDate(dateTime: DateTimeInput, options: FormatDateOptions = {}): string {
  const { locale = DEFAULT_LOCALE, ...dateFormatOptions } = options;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: DEFAULT_TIME_ZONE,
    ...dateFormatOptions,
  }).format(toDate(dateTime));
}

export function formatDateTime(dateTime: DateTimeInput, options: FormatDateOptions = {}): string {
  const { locale = DEFAULT_LOCALE, ...dateFormatOptions } = options;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: DEFAULT_TIME_ZONE,
    ...dateFormatOptions,
  }).format(toDate(dateTime));
}
