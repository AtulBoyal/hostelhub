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
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  MoreVertical
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

type NavItem = {
  name: string;
  href: string;
  icon: any;
  prefetch?: boolean;
  color?: string;
  bgActive?: string;
};

type NavGroup = {
  name: string;
  items: NavItem[];
};

const navigationGroups: NavGroup[] = [
  {
    name: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, prefetch: true },
    ]
  },
  {
    name: "Hostel",
    items: [
      { name: "Laundry", href: "/laundry", icon: WashingMachine, prefetch: true },
      { name: "Maintenance", href: "/maintenance", icon: Wrench, prefetch: true },
      { name: "Water", href: "/water", icon: Droplets, prefetch: true },
      { name: "Wi-Fi", href: "/wifi", icon: Wifi, prefetch: true },
    ]
  },
  {
    name: "Community",
    items: [
      { name: "I Need / I Have", href: "/need-have", icon: ArrowRightLeft },
      { name: "Lost & Found", href: "/lost-found", icon: Search },
      { name: "Community", href: "/community", icon: Users },
      { name: "Announcements", href: "/announcements", icon: Megaphone, prefetch: true },
    ]
  },
  {
    name: "Support",
    items: [
      { name: "Emergency", href: "/emergency", icon: AlertTriangle, color: "text-red-600 group-hover:text-red-700", bgActive: "bg-red-50 text-red-700" },
      { name: "Notifications", href: "/notifications", icon: Bell },
    ]
  }
];

interface SidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  profile?: { name: string; avatar_url: string | null } | null;
  unreadCount?: number;
}

export function Sidebar({ isCollapsed = false, setIsCollapsed, profile, unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const initials = profile?.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  const toggleCollapse = () => {
    if (setIsCollapsed) setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 z-50 transition-[width] duration-300 ease-in-out",
      isCollapsed ? "md:w-20" : "md:w-64"
    )}>
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Brand Area */}
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-white border-b border-slate-100 relative">
          <div className={cn("flex items-center overflow-hidden transition-all duration-300 ease-in-out", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
            <div className="flex flex-col ml-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                Hostel<span className="text-blue-600">Hub</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">
                IITH Community
              </span>
            </div>
          </div>
          
          {/* Logo icon when collapsed */}
          {isCollapsed && (
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center pointer-events-auto">
                <span className="text-white font-bold text-lg">H</span>
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          {!isCollapsed && setIsCollapsed && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 ml-auto flex-shrink-0 z-10" onClick={toggleCollapse}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-4 pb-4">
          <TooltipProvider delay={150}>
            <nav className={cn("flex-1 space-y-6", isCollapsed ? "px-2" : "px-3")}>
              {navigationGroups.map((group) => (
                <div key={group.name} className="space-y-1">
                  {!isCollapsed && (
                    <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      {group.name}
                    </div>
                  )}
                  
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const activeClass = item.bgActive || "bg-blue-50 text-blue-700 font-semibold";
                    
                    const LinkContent = (
                      <Link
                        href={item.href}
                        prefetch={item.prefetch}
                        className={cn(
                          isActive
                            ? activeClass
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                          "group flex items-center py-2 text-sm rounded-lg transition-all duration-200",
                          isCollapsed ? "justify-center px-0 mx-auto w-12 h-10" : "px-3"
                        )}
                      >
                        <div className="relative flex items-center justify-center">
                          <item.icon
                            className={cn(
                              isActive ? (item.color || "text-blue-700") : "text-slate-400 group-hover:text-slate-600",
                              item.color && !isActive ? item.color : "",
                              "flex-shrink-0 h-5 w-5 transition-colors duration-200",
                              isCollapsed ? "mr-0" : "mr-3"
                            )}
                            aria-hidden="true"
                          />
                          {/* Notification Badge on Icon for collapsed mode */}
                          {item.name === "Notifications" && unreadCount > 0 && isCollapsed && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white" />
                          )}
                        </div>
                        
                        {!isCollapsed && (
                          <span className={cn(
                            "flex-1 truncate",
                            isActive ? "font-semibold" : "font-medium"
                          )}>
                            {item.name}
                          </span>
                        )}

                        {/* Notification Badge with text for expanded mode */}
                        {item.name === "Notifications" && unreadCount > 0 && !isCollapsed && (
                          <span className="ml-auto inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    );

                    if (isCollapsed) {
                      return (
                        <Tooltip>
                          <TooltipTrigger>
                            {LinkContent}
                          </TooltipTrigger>
                          <TooltipContent side="right" className="font-medium bg-slate-900 text-white border-slate-800">
                            {item.name}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return <div key={item.name}>{LinkContent}</div>;
                  })}
                </div>
              ))}
            </nav>
          </TooltipProvider>
        </div>
        
        {/* User Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3">
               <TooltipProvider delay={150}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-200" onClick={toggleCollapse}>
                        <ChevronRight className="h-5 w-5 text-slate-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium bg-slate-900 text-white border-slate-800">Expand</TooltipContent>
                  </Tooltip>
               </TooltipProvider>

               <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none rounded-full ring-offset-2 ring-offset-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 transition-all">
                    <Avatar className="h-10 w-10 hover:ring-2 hover:ring-slate-200 transition-all cursor-pointer shadow-sm">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "User"} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="end" className="w-56 mb-2">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{profile?.name || 'User'}</p>
                          <p className="text-xs leading-none text-slate-500">IITH Student</p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/profile" className="w-full flex cursor-pointer"><User className="mr-2 h-4 w-4" /> Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/notifications" className="w-full flex cursor-pointer"><Bell className="mr-2 h-4 w-4" /> Notifications</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-0">
                      <form action={logout} className="w-full">
                        <button type="submit" className="w-full flex items-center px-2 py-1.5 text-sm text-red-600 text-left outline-none cursor-pointer focus:bg-red-50 focus:text-red-700 rounded-sm">
                          <LogOut className="mr-2 h-4 w-4" /> Log out
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ring-offset-2 ring-offset-slate-50 group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "User"} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start truncate">
                    <span className="text-sm font-semibold text-slate-900 truncate w-full text-left leading-tight">{profile?.name || 'Loading...'}</span>
                    <span className="text-[11px] font-medium text-slate-500 truncate w-full text-left mt-0.5">IITH Student</span>
                  </div>
                </div>
                <MoreVertical className="h-5 w-5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-60 mb-2">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                     <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.name || 'User'}</p>
                        <p className="text-xs leading-none text-slate-500">IITH Student</p>
                     </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full flex cursor-pointer"><User className="mr-2 h-4 w-4" /> Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/notifications" className="w-full flex cursor-pointer"><Bell className="mr-2 h-4 w-4" /> Notifications</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                  <form action={logout} className="w-full">
                    <button type="submit" className="w-full flex items-center px-2 py-1.5 text-sm text-red-600 text-left outline-none cursor-pointer focus:bg-red-50 focus:text-red-700 rounded-sm">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
