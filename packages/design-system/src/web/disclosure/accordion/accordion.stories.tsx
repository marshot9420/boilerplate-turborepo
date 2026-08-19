import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Accordion, { AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
  title: "Web/Disclosure/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  args: {
    type: "single",
    collapsible: true,
  },
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
    },
    collapsible: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  render: (args) => {
    return (
      <div className="w-lg max-w-full">
        <Accordion {...args}>
          <AccordionItem value="profile">
            <AccordionTrigger rightSlot="⌄">프로필 정보</AccordionTrigger>
            <AccordionContent>
              사용자의 기본 정보와 공개 프로필 설정을 확인할 수 있습니다.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger rightSlot="⌄">보안 설정</AccordionTrigger>
            <AccordionContent>로그인, 세션, OAuth 계정 연결 상태를 관리합니다.</AccordionContent>
          </AccordionItem>

          <AccordionItem value="notification">
            <AccordionTrigger rightSlot="⌄">알림 설정</AccordionTrigger>
            <AccordionContent>이메일 알림과 서비스 알림 수신 여부를 설정합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
} satisfies Story;

export const DefaultOpen = {
  render: () => {
    return (
      <div className="w-lg max-w-full">
        <Accordion collapsible defaultValue="security" type="single">
          <AccordionItem value="profile">
            <AccordionTrigger rightSlot="⌄">프로필 정보</AccordionTrigger>
            <AccordionContent>
              사용자의 기본 정보와 공개 프로필 설정을 확인할 수 있습니다.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger rightSlot="⌄">보안 설정</AccordionTrigger>
            <AccordionContent>로그인, 세션, OAuth 계정 연결 상태를 관리합니다.</AccordionContent>
          </AccordionItem>

          <AccordionItem value="notification">
            <AccordionTrigger rightSlot="⌄">알림 설정</AccordionTrigger>
            <AccordionContent>이메일 알림과 서비스 알림 수신 여부를 설정합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
} satisfies Story;

export const DisabledItem = {
  render: (args) => {
    return (
      <div className="w-lg max-w-full">
        <Accordion {...args}>
          <AccordionItem value="enabled">
            <AccordionTrigger rightSlot="⌄">활성 항목</AccordionTrigger>
            <AccordionContent>이 항목은 열고 닫을 수 있습니다.</AccordionContent>
          </AccordionItem>

          <AccordionItem value="disabled">
            <AccordionTrigger disabled rightSlot="⌄">
              비활성 항목
            </AccordionTrigger>
            <AccordionContent>이 항목은 비활성 상태입니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
} satisfies Story;

export const Multiple = {
  render: () => {
    return (
      <div className="w-lg max-w-full">
        <Accordion defaultValue={["profile", "security"]} type="multiple">
          <AccordionItem value="profile">
            <AccordionTrigger rightSlot="⌄">프로필 정보</AccordionTrigger>
            <AccordionContent>
              사용자의 기본 정보와 공개 프로필 설정을 확인할 수 있습니다.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger rightSlot="⌄">보안 설정</AccordionTrigger>
            <AccordionContent>로그인, 세션, OAuth 계정 연결 상태를 관리합니다.</AccordionContent>
          </AccordionItem>

          <AccordionItem value="notification">
            <AccordionTrigger rightSlot="⌄">알림 설정</AccordionTrigger>
            <AccordionContent>이메일 알림과 서비스 알림 수신 여부를 설정합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
} satisfies Story;
