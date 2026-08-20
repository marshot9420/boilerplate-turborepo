import type { Meta, StoryObj } from "@repo/storybook-config/react";

import Sidebar, {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarLayout,
  SidebarNav,
  SidebarNavItem,
  SidebarNavLink,
  SidebarNavList,
  SidebarSeparator,
} from "./sidebar";

const meta = {
  title: "Admin/Layout/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => {
    return (
      <SidebarLayout>
        <Sidebar>
          <SidebarHeader>
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md text-sm font-semibold">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Admin</p>
              <p className="text-muted-foreground truncate text-xs">관리자 콘솔</p>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarNav label="관리자 메뉴">
              <SidebarGroup>
                <SidebarGroupLabel>Overview</SidebarGroupLabel>
                <SidebarNavList>
                  <SidebarNavItem>
                    <SidebarNavLink href="#" active>
                      대시보드
                    </SidebarNavLink>
                  </SidebarNavItem>
                  <SidebarNavItem>
                    <SidebarNavLink href="#">사용자</SidebarNavLink>
                  </SidebarNavItem>
                  <SidebarNavItem>
                    <SidebarNavLink href="#">콘텐츠</SidebarNavLink>
                  </SidebarNavItem>
                </SidebarNavList>
              </SidebarGroup>

              <SidebarSeparator />

              <SidebarGroup>
                <SidebarGroupLabel>Danger</SidebarGroupLabel>
                <SidebarNavList>
                  <SidebarNavItem>
                    <SidebarNavLink href="#" tone="danger">
                      삭제된 항목
                    </SidebarNavLink>
                  </SidebarNavItem>
                </SidebarNavList>
              </SidebarGroup>
            </SidebarNav>
          </SidebarContent>

          <SidebarFooter>
            <SidebarNavLink href="#">설정</SidebarNavLink>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="p-6">
            <div className="border-border bg-surface text-foreground rounded-lg border p-6 text-sm">
              관리자 본문 영역
            </div>
          </div>
        </SidebarInset>
      </SidebarLayout>
    );
  },
} satisfies Story;

export const Floating = {
  render: () => {
    return (
      <div className="bg-background p-6">
        <Sidebar variant="floating" hiddenOnMobile={false} sticky={false}>
          <SidebarHeader>Floating Sidebar</SidebarHeader>
          <SidebarContent>
            <SidebarNav>
              <SidebarNavList>
                <SidebarNavItem>
                  <SidebarNavLink href="#" active>
                    대시보드
                  </SidebarNavLink>
                </SidebarNavItem>
                <SidebarNavItem>
                  <SidebarNavLink href="#">설정</SidebarNavLink>
                </SidebarNavItem>
              </SidebarNavList>
            </SidebarNav>
          </SidebarContent>
        </Sidebar>
      </div>
    );
  },
} satisfies Story;

export const Widths = {
  render: () => {
    return (
      <div className="bg-background flex flex-col gap-8 p-6">
        {(["sm", "md", "lg"] as const).map((sidebarWidth) => {
          return (
            <SidebarLayout
              key={sidebarWidth}
              sidebarWidth={sidebarWidth}
              className="border-border min-h-64 overflow-hidden rounded-lg border"
            >
              <Sidebar hiddenOnMobile={false} sticky={false}>
                <SidebarHeader>{sidebarWidth}</SidebarHeader>
                <SidebarContent>
                  <SidebarNavLink href="#" active>
                    메뉴
                  </SidebarNavLink>
                </SidebarContent>
              </Sidebar>

              <SidebarInset>
                <div className="text-foreground p-4 text-sm">sidebarWidth={sidebarWidth}</div>
              </SidebarInset>
            </SidebarLayout>
          );
        })}
      </div>
    );
  },
} satisfies Story;
