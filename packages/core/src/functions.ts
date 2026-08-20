export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function noop(): void {
  // 의도적으로 비어 있음
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
