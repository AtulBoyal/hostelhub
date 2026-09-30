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
import { useState, useRef, useEffect } from "react";

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

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMoreOpen]);

  // close on route change
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto relative" ref={menuRef}>
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
        <button 
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className="inline-flex flex-col items-center justify-center px-2 hover:bg-slate-50 group focus:outline-none"
        >
          <MoreHorizontal className={cn("w-6 h-6 mb-1 transition-colors", isMoreOpen ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600")} />
          <span className={cn("text-[10px] transition-colors", isMoreOpen ? "text-blue-600 font-medium" : "text-slate-500 group-hover:text-blue-600")}>
            More
          </span>
        </button>

        {/* The Custom Dropdown Menu */}
        {isMoreOpen && (
          <div className="absolute bottom-[72px] right-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">More Options</span>
            </div>
            <div className="p-1.5 flex flex-col">
              {moreNavItems.map(item => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <item.icon className={cn("mr-3 h-4 w-4", item.color || "text-slate-500")} />
                  <span className={cn("text-sm font-semibold", item.color || "text-slate-700")}>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
