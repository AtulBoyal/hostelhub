"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Input } from "@/components/ui/input";
import { logout } from "@/app/actions/auth";

interface HeaderProps {
  profile: { name: string; avatar_url: string | null } | null;
  unreadCount: number;
}

export function Header({ profile, unreadCount }: HeaderProps) {
  const initials = profile?.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden flex items-center gap-2">
        <Sheet>
          <SheetTrigger className="p-2 -ml-2 text-slate-500 hover:text-slate-900 focus:outline-none rounded-md hover:bg-slate-100">
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="h-full flex flex-col bg-white">
              <div className="flex items-center h-16 px-6 bg-slate-50 border-b border-slate-200">
                <span className="text-xl font-bold text-slate-900 tracking-tight">Hostel<span className="text-blue-600">Hub</span></span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar profile={profile} unreadCount={unreadCount} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-lg font-bold text-slate-900 tracking-tight md:hidden">Hostel<span className="text-blue-600">Hub</span></span>
      </div>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Search</label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400" aria-hidden="true" />
          <Input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm bg-transparent shadow-none"
            placeholder="Search resources, lost items..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center p-1.5 rounded-full hover:bg-slate-50 focus:outline-none">
              <span className="sr-only">Open user menu</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "User"} />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-slate-900" aria-hidden="true">
                  {profile?.name || 'Loading...'}
                </span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="w-full flex">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-0">
                <form action={logout} className="w-full">
                  <button type="submit" className="w-full flex px-2 py-1.5 text-sm text-red-600 text-left outline-none cursor-default">Log out</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
