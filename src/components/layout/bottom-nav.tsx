"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  WashingMachine, 
  Wrench, 
  Users, 
  MoreHorizontal,
  User,
  Droplets,
  Wifi,
  ArrowRightLeft,
  Search,
  Megaphone,
  Bell,
  AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const bottomNavItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Laundry", href: "/laundry", icon: WashingMachine },
  { name: "Issues", href: "/maintenance", icon: Wrench },
  { name: "Hub", href: "/community", icon: Users },
];

const moreNavItems = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Water", href: "/water", icon: Droplets },
  { name: "Wi-Fi", href: "/wifi", icon: Wifi },
  { name: "Need/Have", href: "/need-have", icon: ArrowRightLeft },
  { name: "Lost & Found", href: "/lost-found", icon: Search },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Emergency", href: "/emergency", icon: AlertTriangle, color: "text-red-600" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-2 hover:bg-slate-50 group"
            >
              <item.icon
                className={cn(
                  "w-6 h-6 mb-1 group-hover:text-blue-600 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-500"
                )}
              />
              <span
                className={cn(
                  "text-[10px] group-hover:text-blue-600 transition-colors",
                  isActive ? "text-blue-600 font-medium" : "text-slate-500"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* More Tab */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex flex-col items-center justify-center px-2 hover:bg-slate-50 group focus:outline-none">
            <MoreHorizontal className="w-6 h-6 mb-1 text-slate-500 group-hover:text-blue-600 transition-colors" />
            <span className="text-[10px] text-slate-500 group-hover:text-blue-600 transition-colors">
              More
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-56 mb-2 mr-2">
            <DropdownMenuLabel>More Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {moreNavItems.map(item => (
                <DropdownMenuItem key={item.name}>
                  <Link href={item.href} className="flex items-center w-full cursor-pointer h-full">
                    <item.icon className={cn("mr-3 h-4 w-4", item.color || "text-slate-500")} />
                    <span className={cn(item.color || "text-slate-700")}>{item.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
