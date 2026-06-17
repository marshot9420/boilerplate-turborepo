import type { Meta, StoryObj } from "@storybook/react-vite";

import Alert, { AlertActions, AlertDescription, AlertTitle } from "./alert";

const InfoIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m0 3.75h.008v.008H12V16.5Zm9-4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
};

const meta = {
  title: "Admin/Feedback/Alert",
  component: Alert,
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["default", "info", "success", "warning", "danger"],
    },
    role: {
      control: "text",
    },
  },
  args: {
    tone: "default",
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <Alert {...args}>
        <AlertTitle>관리자 알림</AlertTitle>
        <AlertDescription>관리자 화면에서 표시되는 기본 알림 메시지입니다.</AlertDescription>
      </Alert>
    );
  },
};

export const WithIcon: Story = {
  args: {
    tone: "info",
    icon: <InfoIcon />,
  },
  render: (args) => {
    return (
      <Alert {...args}>
        <AlertTitle>정보 알림</AlertTitle>
        <AlertDescription>설정 변경 전 확인이 필요한 정보를 안내합니다.</AlertDescription>
      </Alert>
    );
  },
};

export const WithActions: Story = {
  args: {
    tone: "warning",
    icon: <InfoIcon />,
  },
  render: (args) => {
    return (
      <Alert {...args}>
        <AlertTitle>주의가 필요합니다</AlertTitle>
        <AlertDescription>이 작업은 관리자 권한이 필요한 작업입니다.</AlertDescription>
        <AlertActions>
          <button
            type="button"
            className="border-border bg-surface text-foreground rounded-md border px-3 py-2 text-sm font-medium"
          >
            취소
          </button>
          <button
            type="button"
            className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium"
          >
            계속
          </button>
        </AlertActions>
      </Alert>
    );
  },
};

export const Tones: Story = {
  render: () => {
    return (
      <div className="grid max-w-2xl gap-3">
        <Alert tone="default">
          <AlertTitle>Default</AlertTitle>
          <AlertDescription>기본 알림입니다.</AlertDescription>
        </Alert>

        <Alert tone="info" icon={<InfoIcon />}>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>정보성 알림입니다.</AlertDescription>
        </Alert>

        <Alert tone="success" icon={<InfoIcon />}>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>성공 알림입니다.</AlertDescription>
        </Alert>

        <Alert tone="warning" icon={<InfoIcon />}>
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>주의 알림입니다.</AlertDescription>
        </Alert>

        <Alert tone="danger" icon={<InfoIcon />}>
          <AlertTitle>Danger</AlertTitle>
          <AlertDescription>위험 알림입니다.</AlertDescription>
        </Alert>
      </div>
    );
  },
};

export const HeadingLevels: Story = {
  render: () => {
    return (
      <div className="grid max-w-2xl gap-3">
        <Alert tone="info">
          <AlertTitle as="h2">h2 관리자 알림</AlertTitle>
          <AlertDescription>페이지 섹션의 주요 알림으로 사용할 수 있습니다.</AlertDescription>
        </Alert>

        <Alert tone="info">
          <AlertTitle as="h3">h3 관리자 알림</AlertTitle>
          <AlertDescription>하위 섹션 알림으로 사용할 수 있습니다.</AlertDescription>
        </Alert>

        <Alert tone="info">
          <AlertTitle as="p">p 관리자 알림</AlertTitle>
          <AlertDescription>문서 제목 계층에 포함하지 않을 때 사용할 수 있습니다.</AlertDescription>
        </Alert>
      </div>
    );
  },
};
