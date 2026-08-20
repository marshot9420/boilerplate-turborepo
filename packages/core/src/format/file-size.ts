import { formatNumber } from "./number";

const BYTE_UNIT = 1024;

const FILE_SIZE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"] as const;

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new RangeError("File size must be a finite non-negative number.");
  }

  if (bytes === 0) {
    return "0 B";
  }

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(BYTE_UNIT)),
    FILE_SIZE_UNITS.length - 1,
  );

  const value = bytes / BYTE_UNIT ** unitIndex;

  return `${formatNumber(value, {
    maximumFractionDigits: 1,
  })} ${FILE_SIZE_UNITS[unitIndex]}`;
}
