# `@repo/storage`

파일 저장소 인프라 패키지입니다.

`@repo/storage`는 앱에서 사용하는 파일 업로드, 삭제, public URL 생성, signed URL 생성 기능을 공통 인터페이스로 제공합니다.

현재는 테스트와 개발용 `InMemoryStorageProvider`를 제공하며, 추후 Supabase Storage, AWS S3, Cloudflare R2, S3 compatible storage provider를 같은 인터페이스로 추가할 수 있습니다.

---

## 역할

`@repo/storage`가 담당하는 것:

```txt
StorageProvider interface
StorageService
Storage config 기반 service factory
upload object
delete object
public URL 생성
signed upload URL 생성
signed download URL 생성
storage error code
storage 관련 타입
```

`@repo/storage`가 담당하지 않는 것:

```txt
비즈니스 규칙 판단
DB 저장
Prisma query
인증/session 처리
UI 처리
Next.js route 처리
FormData 직접 처리
```

---

## 의존성 방향

허용:

```txt
apps/* → @repo/storage
@repo/storage → @repo/core
```

금지:

```txt
@repo/storage → apps/*
@repo/storage → @repo/domain
@repo/storage → @repo/database
@repo/storage → @repo/auth-next
@repo/storage → @repo/design-system
@repo/storage → @repo/env
```

파일 업로드가 필요한 경우 권장 흐름:

```txt
apps/* Server Action
  → 인증/권한 확인
  → 입력 검증
  → @repo/storage/server
  → StorageService
  → StorageProvider
  → 외부 Storage
```

DB에는 파일 자체가 아니라 다음과 같은 메타데이터만 저장합니다.

```txt
bucket
key
url
contentType
size
visibility
```

---

## Entry Points

### `@repo/storage`

타입과 에러 등 클라이언트 번들에 섞여도 비교적 안전한 요소를 노출합니다.

```ts
import type { StorageObject, StorageResult } from "@repo/storage";
```

### `@repo/storage/server`

서버 전용 entry point입니다.

`server-only`가 적용되어 있으며, 실제 service 생성과 provider 사용은 이 entry point를 통해 수행합니다.

```ts
import { createStorageServiceFromConfig, STORAGE_PROVIDER_TYPE } from "@repo/storage/server";
```

---

## 기본 사용 예시

```ts
import { createStorageServiceFromConfig, STORAGE_PROVIDER_TYPE } from "@repo/storage/server";

const storageService = createStorageServiceFromConfig({
  provider: STORAGE_PROVIDER_TYPE.IN_MEMORY,
  publicBaseUrl: "https://cdn.example.com",
});

const result = await storageService.uploadObject({
  bucket: "products",
  key: "images/product-1.png",
  body: Buffer.from("test-image"),
  contentType: "image/png",
  visibility: "public",
});

if (!result.ok) {
  console.error(result.error);
}
```

---

## Public URL 생성

```ts
const result = storageService.getPublicUrl({
  bucket: "products",
  key: "images/product-1.png",
});

if (result.ok) {
  console.log(result.data);
}
```

---

## Signed URL 생성

### Signed Upload URL

```ts
const result = await storageService.getSignedUploadUrl({
  bucket: "products",
  key: "images/product-1.png",
  expiresInSeconds: 60,
});
```

### Signed Download URL

```ts
const result = await storageService.getSignedDownloadUrl({
  bucket: "products",
  key: "images/product-1.png",
  expiresInSeconds: 60,
});
```

---

## Provider 구조

모든 provider는 `StorageProvider` interface를 구현해야 합니다.

```ts
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
```

현재 제공되는 provider:

```txt
InMemoryStorageProvider
```

추후 추가 후보:

```txt
SupabaseStorageProvider
S3StorageProvider
R2StorageProvider
```

---

## Config 기반 생성

앱에서는 provider를 직접 조립하기보다 config 기반 factory를 사용하는 것을 권장합니다.

```ts
const storageService = createStorageServiceFromConfig({
  provider: STORAGE_PROVIDER_TYPE.IN_MEMORY,
  publicBaseUrl: "https://cdn.example.com",
});
```

추후 실제 provider가 추가되면 config union에 provider 타입을 추가합니다.

예:

```ts
createStorageServiceFromConfig({
  provider: STORAGE_PROVIDER_TYPE.S3,
  bucket: "...",
  region: "...",
  accessKeyId: "...",
  secretAccessKey: "...",
});
```

---

## 에러 처리

스토리지 작업은 throw 대신 `StorageResult`를 반환합니다.

```ts
type StorageResult<TData, TError> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      error: TError;
    };
```

에러 코드는 `STORAGE_ERROR_CODE`에서 관리합니다.

```txt
STORAGE.UPLOAD_FAILED
STORAGE.DELETE_FAILED
STORAGE.PUBLIC_URL_FAILED
STORAGE.SIGNED_URL_FAILED
STORAGE.INVALID_INPUT
```

---

## 테스트

```bash
pnpm --filter @repo/storage test
```

watch mode:

```bash
pnpm --filter @repo/storage test:watch
```

coverage:

```bash
pnpm --filter @repo/storage test:coverage
```

---

## 품질 검사

```bash
pnpm --filter @repo/storage lint
pnpm --filter @repo/storage check-types
pnpm --filter @repo/storage test
```

전체 검사:

```bash
pnpm check
```

---

## 패키지 구조

```txt
packages/storage/
├─ src/
│  ├─ errors/
│  │  ├─ index.ts
│  │  └─ storage-error.ts
│  ├─ providers/
│  │  ├─ index.ts
│  │  ├─ in-memory-storage-provider.ts
│  │  └─ storage-provider.ts
│  ├─ index.ts
│  ├─ server.ts
│  ├─ storage-config.test.ts
│  ├─ storage-config.ts
│  ├─ storage-service.test.ts
│  ├─ storage-service.ts
│  └─ storage.types.ts
├─ eslint.config.js
├─ package.json
├─ README.md
├─ tsconfig.json
└─ vitest.config.ts
```

---

## 설계 원칙

```txt
storage는 파일 저장소 인프라만 담당한다.
storage는 domain/database/auth/design-system/apps를 알지 않는다.
provider 교체가 가능하도록 interface 뒤에 구현을 둔다.
앱은 @repo/storage/server를 통해 서버 전용으로 사용한다.
환경변수는 가능하면 앱 config에서 검증한 뒤 storage config로 주입한다.
domain service 안에서 직접 파일을 업로드하지 않는다.
repository 안에서 직접 외부 storage SDK를 호출하지 않는다.
```
