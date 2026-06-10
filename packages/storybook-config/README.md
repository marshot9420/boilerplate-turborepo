# @repo/storybook-config

Turborepo 내부 패키지와 앱에서 공유하는 Storybook 설정 패키지입니다.

## 역할

이 패키지는 Storybook 설정을 중앙화합니다.

- React 패키지용 Storybook 설정 제공
- Next.js 앱용 Storybook 설정 제공
- 공통 preview 설정 제공
- 공통 addon 설정 제공

## 구조

```txt
packages/storybook-config/
├─ README.md
├─ eslint.config.js
├─ nextjs.ts
├─ package.json
├─ preview.ts
├─ react.ts
└─ tsconfig.json
```

## Export

```ts
import reactConfig from "@repo/storybook-config/react";
import nextJsConfig from "@repo/storybook-config/nextjs";
import preview from "@repo/storybook-config/preview";
```

## React 패키지에서 사용

예: `packages/design-system/.storybook/main.ts`

```ts
import type { StorybookConfig } from "@storybook/react-vite";

import baseConfig from "@repo/storybook-config/react";

const config = {
  ...baseConfig,
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
} satisfies StorybookConfig;

export default config;
```

예: `packages/design-system/.storybook/preview.ts`

```ts
export { default } from "@repo/storybook-config/preview";
```

## Next.js 앱에서 사용

예: `apps/web/.storybook/main.ts`

```ts
import type { StorybookConfig } from "@storybook/nextjs-vite";

import baseConfig from "@repo/storybook-config/nextjs";

const config = {
  ...baseConfig,
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
} satisfies StorybookConfig;

export default config;
```

## Story 파일 예시

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

## 패키지별 적용 기준

```txt
packages/design-system
  → @repo/storybook-config/react

apps/admin
apps/web
  → @repo/storybook-config/nextjs
```

## 실행 예시

```bash
pnpm --filter @repo/design-system storybook
```

## 빌드 예시

```bash
pnpm --filter @repo/design-system build-storybook
```

## 원칙

- `storybook-config`는 Storybook 설정만 담당합니다.
- 실제 컴포넌트 스타일은 각 패키지 또는 앱에서 관리합니다.
- `design-system` 같은 순수 React 패키지는 `react-vite` 설정을 사용합니다.
- Next.js 앱은 `nextjs-vite` 설정을 사용합니다.
- 앱별 디자인 토큰은 이 패키지에서 관리하지 않습니다.
