"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
  profile: { name: string; avatar_url: string | null } | null;
  unreadCount: number;
}

export function AppShell({ children, profile, unreadCount }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isAuthPage) {
    return <div className="min-h-screen bg-slate-50 flex flex-col">{children}</div>;
  }

  return (
    <div className="h-full min-h-screen bg-slate-50">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        profile={profile} 
        unreadCount={unreadCount} 
      />
      <div 
        className={`flex flex-col flex-1 pb-16 md:pb-0 min-h-screen transition-[padding] duration-200 ease-in-out ${
          isCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <Header profile={profile} unreadCount={unreadCount} />
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
