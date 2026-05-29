type LogMeta = Record<string, unknown>;

export type Logger = {
  info: (message: string, meta?: LogMeta) => void;
  warn: (message: string, meta?: LogMeta) => void;
  error: (message: string, meta?: LogMeta) => void;
  debug: (message: string, meta?: LogMeta) => void;
};

export const logger: Logger = {
  info(message, meta) {
    console.info(message, meta ?? {});
  },
  warn(message, meta) {
    console.warn(message, meta ?? {});
  },
  error(message, meta) {
    console.error(message, meta ?? {});
  },
  debug(message, meta) {
    console.debug(message, meta ?? {});
  },
};
