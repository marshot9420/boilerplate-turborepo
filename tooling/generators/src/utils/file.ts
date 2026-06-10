import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { logger } from "./logger";

export interface WriteFileSafeOptions {
  path: string;
  content: string;
}

export async function writeFileSafe(options: WriteFileSafeOptions) {
  const { path, content } = options;

  await mkdir(dirname(path), {
    recursive: true,
  });

  try {
    await writeFile(path, content, {
      flag: "wx",
    });

    logger.info("file.created", {
      path,
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "EEXIST") {
      logger.warn("file.skipped", {
        path,
        reason: "already exists",
      });

      return;
    }

    throw error;
  }
}
