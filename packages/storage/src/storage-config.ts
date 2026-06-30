import { InMemoryStorageProvider } from "./providers";
import { createStorageService } from "./storage-service";

export const STORAGE_PROVIDER_TYPE = {
  IN_MEMORY: "in-memory",
} as const;

export type StorageProviderType =
  (typeof STORAGE_PROVIDER_TYPE)[keyof typeof STORAGE_PROVIDER_TYPE];

export interface InMemoryStorageConfig {
  provider: typeof STORAGE_PROVIDER_TYPE.IN_MEMORY;
  publicBaseUrl?: string;
}

export type StorageConfig = InMemoryStorageConfig;

export function createStorageServiceFromConfig(config: StorageConfig) {
  switch (config.provider) {
    case STORAGE_PROVIDER_TYPE.IN_MEMORY:
      return createStorageService({
        provider: new InMemoryStorageProvider({
          publicBaseUrl: config.publicBaseUrl,
        }),
      });
  }
}
