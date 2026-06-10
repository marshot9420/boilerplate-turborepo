export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    console.info(`[generators] ${message}`, meta ?? "");
  },

  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(`[generators] ${message}`, meta ?? "");
  },

  error(message: string, meta?: Record<string, unknown>) {
    console.error(`[generators] ${message}`, meta ?? "");
  },
};
