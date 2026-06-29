import type { StorageError } from "../errors";
import type {
  DeleteStorageObjectInput,
  GetPublicStorageUrlInput,
  GetSignedStorageUrlInput,
  StorageObject,
  StorageResult,
  UploadStorageObjectInput,
} from "../storage.types";

export interface StorageProvider {
  uploadObject(
    input: UploadStorageObjectInput,
  ): Promise<StorageResult<StorageObject, StorageError>>;

  deleteObject(input: DeleteStorageObjectInput): Promise<StorageResult<void, StorageError>>;

  getPublicUrl(input: GetPublicStorageUrlInput): StorageResult<string, StorageError>;

  getSignedUploadUrl(input: GetSignedStorageUrlInput): Promise<StorageResult<string, StorageError>>;

  getSignedDownloadUrl(
    input: GetSignedStorageUrlInput,
  ): Promise<StorageResult<string, StorageError>>;
}
