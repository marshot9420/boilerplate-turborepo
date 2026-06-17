import type { Meta, StoryObj } from "@storybook/react-vite";

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
  title: "Web/Layout/Sidebar",
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
              W
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Web</p>
              <p className="text-muted-foreground truncate text-xs">서비스 메뉴</p>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarNav label="서비스 메뉴">
              <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarNavList>
                  <SidebarNavItem>
                    <SidebarNavLink href="#" active>
                      홈
                    </SidebarNavLink>
                  </SidebarNavItem>
                  <SidebarNavItem>
                    <SidebarNavLink href="#">내 정보</SidebarNavLink>
                  </SidebarNavItem>
                  <SidebarNavItem>
                    <SidebarNavLink href="#">설정</SidebarNavLink>
                  </SidebarNavItem>
                </SidebarNavList>
              </SidebarGroup>

              <SidebarSeparator />

              <SidebarGroup>
                <SidebarGroupLabel>Account</SidebarGroupLabel>
                <SidebarNavList>
                  <SidebarNavItem>
                    <SidebarNavLink href="#" tone="danger">
                      탈퇴
                    </SidebarNavLink>
                  </SidebarNavItem>
                </SidebarNavList>
              </SidebarGroup>
            </SidebarNav>
          </SidebarContent>

          <SidebarFooter>
            <SidebarNavLink href="#">로그아웃</SidebarNavLink>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="p-6">
            <div className="border-border bg-surface text-foreground rounded-lg border p-6 text-sm">
              웹 본문 영역
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
                    홈
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
