import type { PaginationMeta } from "@repo/core/pagination";
import type { Meta, StoryObj } from "@repo/storybook-config/react";


import Pagination, {
  PaginationButton,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "./pagination";

const defaultMeta: PaginationMeta = {
  page: 5,
  limit: 10,
  totalCount: 100,
  totalPages: 10,
  hasNextPage: true,
  hasPreviousPage: true,
};

const meta = {
  title: "Web/Navigation/Pagination",
  component: Pagination,
  args: {
    meta: defaultMeta,
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const FirstPage = {
  args: {
    meta: {
      ...defaultMeta,
      page: 1,
      hasPreviousPage: false,
      hasNextPage: true,
    },
  },
} satisfies Story;

export const LastPage = {
  args: {
    meta: {
      ...defaultMeta,
      page: 10,
      hasPreviousPage: true,
      hasNextPage: false,
    },
  },
} satisfies Story;

export const WithEllipsis = {
  args: {
    meta: {
      ...defaultMeta,
      page: 10,
      totalPages: 20,
      totalCount: 200,
    },
  },
} satisfies Story;

export const LinkMode = {
  render: () => {
    return <Pagination meta={defaultMeta} getHref={(page) => `/contents?page=${page}`} />;
  },
} satisfies Story;

export const CustomLabels = {
  render: () => {
    return (
      <Pagination
        meta={defaultMeta}
        previousLabel="Prev"
        nextLabel="Next"
        renderPageLabel={(page) => `P${page}`}
      />
    );
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const Composed = {
  render: () => {
    return (
      <PaginationList>
        <PaginationItem>
          <PaginationButton>이전</PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationButton active>1</PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/contents?page=2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/contents?page=10">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationButton>다음</PaginationButton>
        </PaginationItem>
      </PaginationList>
    );
  },
} satisfies Story;
