"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  WashingMachine,
  Wrench,
  ArrowRightLeft,
  Search,
  Wifi,
  Droplets,
  Megaphone,
  Users,
  AlertTriangle,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Laundry", href: "/laundry", icon: WashingMachine },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "I Need / I Have", href: "/need-have", icon: ArrowRightLeft },
  { name: "Lost & Found", href: "/lost-found", icon: Search },
  { name: "Wi-Fi", href: "/wifi", icon: Wifi },
  { name: "Water", href: "/water", icon: Droplets },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
  { name: "Community", href: "/community", icon: Users },
  { name: "Emergency", href: "/emergency", icon: AlertTriangle, color: "text-red-600" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 z-50">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-6 bg-slate-50 border-b border-slate-200">
          <span className="text-xl font-bold text-slate-900 tracking-tight">Hostel<span className="text-blue-600">Hub</span></span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-4 pb-4 shadow-inner">
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? "text-blue-700" : "text-slate-400 group-hover:text-slate-500",
                      item.color ? item.color : "",
                      "flex-shrink-0 -ml-1 mr-3 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  <span className={item.color ? item.color : ""}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
