좋습니다. `@repo/storage`는 “외부 서비스/인프라 책임이 독립적일 때” 분리 후보에 해당하므로, 패키지로 빼도 자연스럽습니다.

작업 순서는 이렇게 가면 됩니다.

1. `packages/storage/` 생성

2. `package.json`, `tsconfig.json`, `eslint.config.js`, `vitest.config.ts` 추가
   기존 Node 패키지 컨벤션을 따라 `@repo/typescript-config`, `@repo/eslint-config`, `@repo/vitest-config`를 사용합니다.

3. `src/` 기본 구조 생성

```txt
packages/storage/src/
├─ errors/
├─ providers/
├─ storage.client.ts
├─ storage.service.ts
├─ storage.types.ts
└─ index.ts
```

4. 우선 최소 인터페이스 정의

```txt
uploadFile
deleteFile
getPublicUrl
getSignedUploadUrl
getSignedDownloadUrl
```

5. Provider 추상화 추가

```txt
StorageProvider interface
SupabaseStorageProvider 또는 S3StorageProvider
```

6. 환경변수 추가

```txt
STORAGE_PROVIDER
STORAGE_BUCKET
STORAGE_PUBLIC_URL
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY
```

그리고 `@repo/env` 또는 앱별 env schema에 연결합니다.

7. `turbo.json`의 `globalEnv`에 storage 관련 env 추가

8. `pnpm-workspace.yaml`은 보통 `packages/*` 패턴이면 수정 불필요

9. 필요한 앱에 의존성 추가

```bash
pnpm --filter web add @repo/storage@workspace:*
pnpm --filter admin add @repo/storage@workspace:*
```

10. 실제 사용처 연결
    예를 들면 상품 이미지 업로드는 `apps/admin`의 Server Action → `@repo/storage` → provider 순서로 호출합니다.

11. 단위 테스트 작성
    provider mock 기반으로 upload/delete/url 생성 정도부터 테스트합니다.

12. 경계 검사 업데이트
    `check:boundaries` 규칙에서 `apps/* → storage`는 허용하고, `storage → apps/*`, `storage → domain/database/design-system` 같은 방향은 막는 게 좋습니다.

최소 시작 기준은 **“Provider 추상화 + env 검증 + upload/delete/url + 테스트”** 정도면 충분합니다. 처음부터 이미지 리사이징, 바이러스 스캔, CDN purge, private ACL까지 넣지는 않는 게 좋습니다.
