import type { Meta, StoryObj } from "@repo/storybook-config/nextjs";

import { URLS } from "@/constants";

import SocialLoginButtons from "./social-login-buttons";

const meta = {
  title: "Features/Auth/SocialLoginButtons",
  component: SocialLoginButtons,
} satisfies Meta<typeof SocialLoginButtons>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GoogleOnly: Story = {
  args: {
    providers: [
      {
        providerId: "google",
        href: URLS.API.AUTH.GOOGLE,
      },
    ],
  },
};
