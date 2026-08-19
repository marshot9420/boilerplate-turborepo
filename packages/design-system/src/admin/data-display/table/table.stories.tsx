import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Table, {
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "Admin/Data Display/Table",
  component: Table,
  parameters: {
    layout: "padded",
  },
  args: {
    fullWidth: true,
  },
  argTypes: {
    fullWidth: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

const rows = [
  {
    id: "1",
    name: "MARSHOT",
    role: "ADMIN",
    status: "ACTIVE",
    amount: "₩120,000",
  },
  {
    id: "2",
    name: "Arieten",
    role: "USER",
    status: "PENDING",
    amount: "₩80,000",
  },
  {
    id: "3",
    name: "Eten",
    role: "USER",
    status: "INACTIVE",
    amount: "₩40,000",
  },
];

export const Default = {
  render: (args) => {
    return (
      <Table {...args}>
        <TableCaption>사용자 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>권한</TableHead>
            <TableHead>상태</TableHead>
            <TableHead textAlign="right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell textAlign="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
} satisfies Story;

export const SelectedRow = {
  render: (args) => {
    return (
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>권한</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id} selected={index === 1}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
} satisfies Story;

export const WithFooter = {
  render: (args) => {
    return (
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>항목</TableHead>
            <TableHead textAlign="right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>매출</TableCell>
            <TableCell textAlign="right">₩120,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>비용</TableCell>
            <TableCell textAlign="right">₩40,000</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>합계</TableCell>
            <TableCell textAlign="right">₩80,000</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  },
} satisfies Story;

export const Empty = {
  render: (args) => {
    return (
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>권한</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableEmpty colSpan={3} />
        </TableBody>
      </Table>
    );
  },
} satisfies Story;

export const NotFullWidth = {
  args: {
    fullWidth: false,
  },
  render: (args) => {
    return (
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>MARSHOT</TableCell>
            <TableCell>ACTIVE</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  },
} satisfies Story;
