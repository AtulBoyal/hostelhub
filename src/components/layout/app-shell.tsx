"use client";

import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full min-h-screen bg-slate-50">
      <Sidebar />
      <div className="md:pl-64 flex flex-col flex-1 pb-16 md:pb-0 min-h-screen">
        <Header />
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
