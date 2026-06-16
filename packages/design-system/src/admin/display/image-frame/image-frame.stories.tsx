import type { Meta, StoryObj } from "@storybook/react-vite";

import ImageFrame from "./image-frame";

const sampleImageUrl = "https://picsum.photos/id/1015/800/450";

const meta = {
  title: "Admin/Display/ImageFrame",
  component: ImageFrame,
  args: {
    src: sampleImageUrl,
    alt: "샘플 이미지",
    ratio: "video",
    fit: "cover",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "muted", "surface", "outline"],
    },
    ratio: {
      control: "inline-radio",
      options: ["auto", "square", "video", "wide"],
    },
    fit: {
      control: "inline-radio",
      options: ["cover", "contain"],
    },
    fullWidth: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof ImageFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    variant: "default",
  },
} satisfies Story;

export const Surface = {
  args: {
    variant: "surface",
  },
} satisfies Story;

export const Contain = {
  args: {
    fit: "contain",
    variant: "surface",
  },
} satisfies Story;

export const Fallback = {
  args: {
    src: undefined,
    alt: undefined,
    fallback: <span className="text-sm">이미지가 없습니다</span>,
  },
} satisfies Story;

export const WithOverlay = {
  args: {
    children: (
      <div className="bg-background/85 absolute inset-x-0 bottom-0 px-3 py-2 text-left text-sm font-medium">
        관리자 이미지
      </div>
    ),
  },
} satisfies Story;

export const Ratios = {
  render: () => {
    return (
      <div className="grid max-w-4xl gap-4 md:grid-cols-3">
        <ImageFrame src={sampleImageUrl} alt="Square" ratio="square" />
        <ImageFrame src={sampleImageUrl} alt="Video" ratio="video" />
        <ImageFrame src={sampleImageUrl} alt="Wide" ratio="wide" />
      </div>
    );
  },
} satisfies Story;
