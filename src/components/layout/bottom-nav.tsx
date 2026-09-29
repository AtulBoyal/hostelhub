"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, WashingMachine, Wrench, Users, User } from "lucide-react";

const bottomNavItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Laundry", href: "/laundry", icon: WashingMachine },
  { name: "Issues", href: "/maintenance", icon: Wrench },
  { name: "Hub", href: "/community", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
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
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-slate-50 group"
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
      </div>
    </div>
  );
}
