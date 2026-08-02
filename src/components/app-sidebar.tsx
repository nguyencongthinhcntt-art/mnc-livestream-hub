"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  CalendarRange,
  ListChecks,
  Radio,
  Search,
} from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

const navItems = [
  {
    title: "Portfolio",
    subtitle: "Danh mục chương trình",
    href: "/portfolio",
    icon: Briefcase,
  },
  {
    title: "Planning",
    subtitle: "Lập kế hoạch & Ngân sách",
    href: "/planning",
    icon: CalendarRange,
  },
  {
    title: "Checklist",
    subtitle: "Công việc Trước - Trong - Sau",
    href: "/checklist",
    icon: ListChecks,
  },
  {
    title: "P&L & Performance",
    subtitle: "Báo cáo",
    href: "/performance",
    icon: BarChart3,
  },
];

const sidebarClerkAppearance = {
  ...clerkAppearance,
  elements: {
    ...clerkAppearance.elements,
    organizationSwitcherTrigger:
      "w-full justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-zinc-50 transition-colors",
    organizationSwitcherTriggerIcon: "text-zinc-500",
    organizationPreviewMainIdentifier: "text-sm font-medium text-zinc-900",
    organizationPreviewSecondaryIdentifier: "text-xs text-zinc-500",
    userButtonBox: "flex-row-reverse gap-3",
    userButtonTrigger:
      "rounded-lg border border-zinc-200 p-1 shadow-sm hover:bg-zinc-50 transition-colors",
    userButtonOuterIdentifier: "text-sm font-medium text-zinc-900",
    userButtonPopoverCard: "shadow-lg border border-zinc-200",
  },
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="flex flex-col gap-5 border-b border-zinc-200 p-4">
        <Link href="/" className="flex items-center gap-3 px-1">
          <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
            <Radio className="size-4" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-zinc-900">
              MNC Livestream Hub
            </p>
            <p className="truncate text-xs text-zinc-500">Campaign Management</p>
          </div>
        </Link>

        <OrganizationSwitcher
          appearance={sidebarClerkAppearance}
          hidePersonal
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
        />
      </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isActive
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon
                className={`mt-0.5 size-4 shrink-0 ${
                  isActive
                    ? "text-zinc-900"
                    : "text-zinc-400 group-hover:text-zinc-600"
                }`}
                strokeWidth={2}
              />
              <div className="min-w-0">
                <p
                  className={`truncate text-sm ${
                    isActive ? "font-medium" : "font-medium"
                  }`}
                >
                  {item.title}
                </p>
                <p className="truncate text-xs text-zinc-500">{item.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4">
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 shadow-sm">
          <UserButton appearance={sidebarClerkAppearance} showName />
        </div>
      </div>
    </aside>
  );
}
