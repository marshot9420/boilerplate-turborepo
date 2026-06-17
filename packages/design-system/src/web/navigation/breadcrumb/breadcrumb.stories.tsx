import type { Meta, StoryObj } from "@storybook/react-vite";

import Breadcrumb, {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

const meta = {
  title: "Web/Navigation/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => {
    return (
      <Breadcrumb label="페이지 경로">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">홈</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">콘텐츠</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>상세</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  },
} satisfies Story;

export const WithEllipsis = {
  render: () => {
    return (
      <Breadcrumb label="페이지 경로">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">홈</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">카테고리</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>상세</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  },
} satisfies Story;

export const CustomSeparator = {
  render: () => {
    return (
      <Breadcrumb label="페이지 경로">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">홈</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>›</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">프로필</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>›</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>설정</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  },
} satisfies Story;

export const LongPage = {
  render: () => {
    return (
      <div className="w-80">
        <Breadcrumb label="페이지 경로">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">홈</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>아주 긴 공개 페이지 제목이 들어가는 경우</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  },
} satisfies Story;
