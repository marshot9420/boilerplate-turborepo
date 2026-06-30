import type { StorageProvider } from "./providers";
import type {
  DeleteStorageObjectInput,
  GetPublicStorageUrlInput,
  GetSignedStorageUrlInput,
  UploadStorageObjectInput,
} from "./storage.types";

export interface CreateStorageServiceOptions {
  provider: StorageProvider;
}

export function createStorageService({ provider }: CreateStorageServiceOptions) {
  return {
    uploadObject(input: UploadStorageObjectInput) {
      return provider.uploadObject(input);
    },

    deleteObject(input: DeleteStorageObjectInput) {
      return provider.deleteObject(input);
    },

    getPublicUrl(input: GetPublicStorageUrlInput) {
      return provider.getPublicUrl(input);
    },

    getSignedUploadUrl(input: GetSignedStorageUrlInput) {
      return provider.getSignedUploadUrl(input);
    },

    getSignedDownloadUrl(input: GetSignedStorageUrlInput) {
      return provider.getSignedDownloadUrl(input);
    },
  };
}

export type StorageService = ReturnType<typeof createStorageService>;
