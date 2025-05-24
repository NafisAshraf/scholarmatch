import { AppSidebar } from "@/components/app-sidebar";
import { LogoutButton } from "@/components/logout-button";
import { NavActions } from "@/components/nav-actions";
import ProfileDropdown from "@/components/profile-dropdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        {/* <SidebarInset className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 transition-colors duration-300"> */}
        <SidebarInset>
          <header className="fixed top-0 z-10 flex h-14 shrink-0 items-center gap-2 ">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              {/* <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="line-clamp-1">
                      Scholarships
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
            </div>
            {/* <div className="ml-auto px-3">
              <NavActions />
              <ProfileDropdown />
            </div> */}
          </header>
          <div>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
