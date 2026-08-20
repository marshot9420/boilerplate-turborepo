const DEFAULT_LOCALE = "ko-KR";

const DEFAULT_CURRENCY = "KRW";

export type FormatNumberOptions = Intl.NumberFormatOptions & {
  locale?: string;
};

export type FormatCurrencyOptions = Omit<Intl.NumberFormatOptions, "style" | "currency"> & {
  locale?: string;
  currency?: string;
};

export type FormatPercentageOptions = Omit<Intl.NumberFormatOptions, "style"> & {
  locale?: string;
};

export function formatNumber(value: number, options: FormatNumberOptions = {}): string {
  const { locale = DEFAULT_LOCALE, ...numberFormatOptions } = options;

  return new Intl.NumberFormat(locale, numberFormatOptions).format(value);
}

export function formatCurrency(amount: number, options: FormatCurrencyOptions = {}): string {
  const { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY, ...numberFormatOptions } = options;

  return new Intl.NumberFormat(locale, {
    ...numberFormatOptions,
    style: "currency",
    currency,
  }).format(amount);
}

export function formatPercentage(value: number, options: FormatPercentageOptions = {}): string {
  const { locale = DEFAULT_LOCALE, ...numberFormatOptions } = options;

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    ...numberFormatOptions,
    style: "percent",
  }).format(value / 100);
}
