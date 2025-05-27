"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Command,
  FileText,
  Search,
  User2,
  Home,
  GraduationCap,
  Sparkle,
  BookOpen,
  Award,
  Sparkles,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import ProfileDropdown from "./profile-dropdown";

// This is sample data
const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/default.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Matched Scholarships",
      url: "/matched-scholarships",
      icon: Sparkles,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "Documents",
      url: "/documents",
      icon: FileText,
    },
    // {
    //   title: "Profile",
    //   url: "/profile",
    //   icon: User2,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setOpen } = useSidebar();

  const activeItem =
    data.navMain.find((item) => pathname === item.url) || data.navMain[0];

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r "
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/dashboard">
                  <div className="bg-button text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <GraduationCap className="size-5" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">ScholarMatch</span>
                    <span className="truncate text-xs">
                      Your personal scholarship counselor
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setOpen(false);
                      }}
                      isActive={pathname === item.url}
                      className="px-2.5 md:px-2"
                      asChild
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <ProfileDropdown />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
    </Sidebar>
  );
}
