"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileBarChart,
  CreditCard,
  Settings,
  BarChart3,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileBarChart, label: "Reports", href: "/reports" },
  { icon: BarChart3, label: "Analysis", href: "/analysis" },
  // { icon: CreditCard, label: "Billing", href: "/billing" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-16 bg-background border-r border-border flex-col items-center py-4 space-y-2 hidden md:flex">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center transition-colors group relative",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-border">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
