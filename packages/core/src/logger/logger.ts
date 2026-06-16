export type LogLevel = "info" | "warn" | "error";

export type LogMeta = Record<string, unknown>;

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  meta?: LogMeta;
}

function createLogPayload(level: LogLevel, message: string, meta?: LogMeta): LogPayload {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  };
}

function stringifyLogPayload(payload: LogPayload): string {
  return JSON.stringify(payload);
}

export const logger = {
  info(message: string, meta?: LogMeta): void {
    console.info(stringifyLogPayload(createLogPayload("info", message, meta)));
  },

  warn(message: string, meta?: LogMeta): void {
    console.warn(stringifyLogPayload(createLogPayload("warn", message, meta)));
  },

  error(message: string, meta?: LogMeta): void {
    console.error(stringifyLogPayload(createLogPayload("error", message, meta)));
  },
};
