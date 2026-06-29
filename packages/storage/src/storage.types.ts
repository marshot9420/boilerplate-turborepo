export type StorageVisibility = "public" | "private";

export interface StorageObject {
  bucket: string;
  key: string;
  contentType?: string;
  size?: number;
  visibility: StorageVisibility;
}

export interface UploadStorageObjectInput {
  bucket: string;
  key: string;
  body: Uint8Array | Buffer;
  contentType?: string;
  visibility?: StorageVisibility;
}

export interface DeleteStorageObjectInput {
  bucket: string;
  key: string;
}

export interface GetPublicStorageUrlInput {
  bucket: string;
  key: string;
}

export interface GetSignedStorageUrlInput {
  bucket: string;
  key: string;
  expiresInSeconds: number;
}

export interface StorageSuccess<TData> {
  ok: true;
  data: TData;
}

export interface StorageFailure<TError> {
  ok: false;
  error: TError;
}

export type StorageResult<TData, TError> = StorageSuccess<TData> | StorageFailure<TError>;
