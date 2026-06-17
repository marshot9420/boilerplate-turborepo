import type { Meta, StoryObj } from "@storybook/react-vite";

import Tabs, { TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Admin/Navigation/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => {
    return (
      <Tabs defaultValue="overview" className="w-[480px]">
        <TabsList aria-label="관리자 탭">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="users">사용자</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="border-border bg-surface text-foreground rounded-md border p-4 text-sm">
            개요 콘텐츠
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="border-border bg-surface text-foreground rounded-md border p-4 text-sm">
            사용자 콘텐츠
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="border-border bg-surface text-foreground rounded-md border p-4 text-sm">
            설정 콘텐츠
          </div>
        </TabsContent>
      </Tabs>
    );
  },
} satisfies Story;

export const Sizes = {
  render: () => {
    return (
      <div className="flex w-[480px] flex-col gap-6">
        <Tabs defaultValue="overview">
          <TabsList aria-label="작은 탭" size="sm">
            <TabsTrigger value="overview" size="sm">
              개요
            </TabsTrigger>
            <TabsTrigger value="settings" size="sm">
              설정
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs defaultValue="overview">
          <TabsList aria-label="기본 탭" size="md">
            <TabsTrigger value="overview" size="md">
              개요
            </TabsTrigger>
            <TabsTrigger value="settings" size="md">
              설정
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs defaultValue="overview">
          <TabsList aria-label="큰 탭" size="lg">
            <TabsTrigger value="overview" size="lg">
              개요
            </TabsTrigger>
            <TabsTrigger value="settings" size="lg">
              설정
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
  },
} satisfies Story;

export const FullWidth = {
  render: () => {
    return (
      <Tabs defaultValue="overview" className="w-[480px]">
        <TabsList aria-label="관리자 탭" fullWidth>
          <TabsTrigger value="overview" fullWidth>
            개요
          </TabsTrigger>
          <TabsTrigger value="users" fullWidth>
            사용자
          </TabsTrigger>
          <TabsTrigger value="settings" fullWidth>
            설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="border-border bg-surface text-foreground rounded-md border p-4 text-sm">
            fullWidth 탭입니다.
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="border-border bg-surface text-foreground rounded-md border p-4 text-sm">
            사용자 콘텐츠
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="border-border bg-surface text-foreground rounded-md border p-4 text-sm">
            설정 콘텐츠
          </div>
        </TabsContent>
      </Tabs>
    );
  },
} satisfies Story;

export const Disabled = {
  render: () => {
    return (
      <Tabs defaultValue="overview" className="w-[480px]">
        <TabsList aria-label="관리자 탭">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="users" disabled>
            사용자
          </TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="border-border bg-surface text-foreground rounded-md border p-4 text-sm">
            비활성 탭이 포함된 예시입니다.
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="border-border bg-surface text-foreground rounded-md border p-4 text-sm">
            설정 콘텐츠
          </div>
        </TabsContent>
      </Tabs>
    );
  },
} satisfies Story;
