import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import SocialLoginButtons from "./social-login-buttons";

const meta: Meta<typeof SocialLoginButtons> = {
  title: "Features/Auth/SocialLoginButtons",
  component: SocialLoginButtons,
  args: {
    providers: ["google", "naver", "kakao"],
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const GoogleOnly = {
  args: {
    providers: ["google"],
  },
} satisfies Story;

export const NaverAndKakao = {
  args: {
    providers: ["naver", "kakao"],
  },
} satisfies Story;
