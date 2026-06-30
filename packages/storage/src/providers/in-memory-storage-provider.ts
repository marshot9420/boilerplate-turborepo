import { STORAGE_ERROR_CODE, createStorageError } from "../errors";
import type { StorageError } from "../errors";
import type {
  DeleteStorageObjectInput,
  GetPublicStorageUrlInput,
  GetSignedStorageUrlInput,
  StorageObject,
  StorageResult,
  UploadStorageObjectInput,
} from "../storage.types";
import type { StorageProvider } from "./storage-provider";

export interface InMemoryStorageProviderOptions {
  publicBaseUrl?: string;
}

interface InMemoryStoredObject extends StorageObject {
  body: Uint8Array | Buffer;
}

export class InMemoryStorageProvider implements StorageProvider {
  private readonly objects = new Map<string, InMemoryStoredObject>();
  private readonly publicBaseUrl: string;

  constructor({
    publicBaseUrl = "https://storage.example.com",
  }: InMemoryStorageProviderOptions = {}) {
    this.publicBaseUrl = publicBaseUrl.replace(/\/+$/, "");
  }

  async uploadObject(
    input: UploadStorageObjectInput,
  ): Promise<StorageResult<StorageObject, StorageError>> {
    const validationError = this.validateBucketAndKey(input.bucket, input.key);

    if (validationError) {
      return {
        ok: false,
        error: validationError,
      };
    }

    const visibility = input.visibility ?? "private";

    const object: InMemoryStoredObject = {
      bucket: input.bucket,
      key: input.key,
      body: input.body,
      contentType: input.contentType,
      size: input.body.byteLength,
      visibility,
    };

    this.objects.set(this.createObjectId(input.bucket, input.key), object);

    return {
      ok: true,
      data: {
        bucket: object.bucket,
        key: object.key,
        contentType: object.contentType,
        size: object.size,
        visibility: object.visibility,
      },
    };
  }

  async deleteObject(input: DeleteStorageObjectInput): Promise<StorageResult<void, StorageError>> {
    const validationError = this.validateBucketAndKey(input.bucket, input.key);

    if (validationError) {
      return {
        ok: false,
        error: validationError,
      };
    }

    this.objects.delete(this.createObjectId(input.bucket, input.key));

    return {
      ok: true,
      data: undefined,
    };
  }

  getPublicUrl(input: GetPublicStorageUrlInput): StorageResult<string, StorageError> {
    const validationError = this.validateBucketAndKey(input.bucket, input.key);

    if (validationError) {
      return {
        ok: false,
        error: validationError,
      };
    }

    return {
      ok: true,
      data: this.createPublicUrl(input.bucket, input.key),
    };
  }

  async getSignedUploadUrl(
    input: GetSignedStorageUrlInput,
  ): Promise<StorageResult<string, StorageError>> {
    const validationError = this.validateSignedUrlInput(input);

    if (validationError) {
      return {
        ok: false,
        error: validationError,
      };
    }

    return {
      ok: true,
      data: this.createSignedUrl(input.bucket, input.key, "upload", input.expiresInSeconds),
    };
  }

  async getSignedDownloadUrl(
    input: GetSignedStorageUrlInput,
  ): Promise<StorageResult<string, StorageError>> {
    const validationError = this.validateSignedUrlInput(input);

    if (validationError) {
      return {
        ok: false,
        error: validationError,
      };
    }

    return {
      ok: true,
      data: this.createSignedUrl(input.bucket, input.key, "download", input.expiresInSeconds),
    };
  }

  hasObject(bucket: string, key: string) {
    return this.objects.has(this.createObjectId(bucket, key));
  }

  private validateSignedUrlInput(input: GetSignedStorageUrlInput): StorageError | null {
    const validationError = this.validateBucketAndKey(input.bucket, input.key);

    if (validationError) {
      return validationError;
    }

    if (!Number.isInteger(input.expiresInSeconds) || input.expiresInSeconds <= 0) {
      return createStorageError(
        STORAGE_ERROR_CODE.INVALID_INPUT,
        "expiresInSeconds는 1 이상의 정수여야 합니다.",
      );
    }

    return null;
  }

  private validateBucketAndKey(bucket: string, key: string): StorageError | null {
    if (bucket.trim().length === 0) {
      return createStorageError(
        STORAGE_ERROR_CODE.INVALID_INPUT,
        "bucket은 비어 있을 수 없습니다.",
      );
    }

    if (key.trim().length === 0) {
      return createStorageError(STORAGE_ERROR_CODE.INVALID_INPUT, "key는 비어 있을 수 없습니다.");
    }

    return null;
  }

  private createObjectId(bucket: string, key: string) {
    return `${bucket}/${key}`;
  }

  private createPublicUrl(bucket: string, key: string) {
    return `${this.publicBaseUrl}/${encodeURIComponent(bucket)}/${this.encodeKey(key)}`;
  }

  private createSignedUrl(
    bucket: string,
    key: string,
    operation: "upload" | "download",
    expiresInSeconds: number,
  ) {
    const publicUrl = this.createPublicUrl(bucket, key);

    return `${publicUrl}?operation=${operation}&expiresIn=${expiresInSeconds}&signature=in-memory`;
  }

  private encodeKey(key: string) {
    return key.split("/").map(encodeURIComponent).join("/");
  }
}
