"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  UtensilsCrossedIcon,
  TableIcon,
  UsersIcon,
  ClipboardListIcon,
  StoreIcon,
  ChevronRightIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NavUser } from "@/components/nav-user"

import { type User, imageUrl } from "@/lib/api"

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  items?: { title: string; url: string }[]
}

const navMain: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Menu",
    url: "/dashboard/menu",
    icon: UtensilsCrossedIcon,
    items: [
      { title: "Categories", url: "/dashboard/menu" },
      { title: "Menu Items", url: "/dashboard/menu" },
    ],
  },
  {
    title: "Tables & QR",
    url: "/dashboard/tables",
    icon: TableIcon,
  },
  {
    title: "Operations",
    url: "/dashboard/orders",
    icon: ClipboardListIcon,
    items: [
      { title: "Active Orders", url: "/dashboard/orders" },
      { title: "Kitchen Display", url: "/dashboard/kitchen" },
      { title: "Payments", url: "/dashboard/payments" },
    ],
  },
  {
    title: "Management",
    url: "/dashboard/staff",
    icon: UsersIcon,
    items: [
      { title: "Staff", url: "/dashboard/staff" },
      { title: "Account", url: "/dashboard/account" },
      { title: "Billing", url: "/dashboard/billing" },
      { title: "Notifications", url: "/dashboard/notifications" },
      { title: "Settings", url: "/dashboard/settings" },
      { title: "Help & Support", url: "/dashboard/help" },
    ],
  },
  {
    title: "Upgrade",
    url: "/dashboard/upgrade",
    icon: SparklesIcon,
  },
]

export function RestaurantSidebar({
  user,
  ...props
}: { user: User | null } & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {}
      for (const item of navMain) {
        if (item.items) {
          const isActive =
            pathname === item.url || pathname.startsWith(item.url + "/")
          if (isActive) initial[item.title] = true
        }
      }
      return initial
    }
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              tooltip={user?.restaurant?.name || "FoodPoint"}
              render={<Link href="/dashboard" />}
            >
              {user?.restaurant?.logo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={imageUrl(user.restaurant.logo_url) ?? ""}
                  alt={user.restaurant.name}
                  className="aspect-square size-8 rounded-lg object-cover"
                />
              ) : (
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <StoreIcon className="size-4" />
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.restaurant?.name || "FoodPoint"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  FoodPoint
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url + "/")

                if (!item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        render={<Link href={item.url} />}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <Collapsible
                    key={item.title}
                    open={!!openGroups[item.title]}
                    onOpenChange={(open: boolean) =>
                      setOpenGroups((prev) => ({ ...prev, [item.title]: open }))
                    }
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        }
                      />
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((sub) => (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                isActive={pathname === sub.url}
                                render={<Link href={sub.url} />}
                              >
                                <span>{sub.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "User",
            email: user?.email || "",
            avatar: user?.avatar_url || undefined,
            role: user?.role,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
