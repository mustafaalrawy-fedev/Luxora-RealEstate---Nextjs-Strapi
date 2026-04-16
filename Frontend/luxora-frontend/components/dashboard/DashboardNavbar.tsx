"use client";

import { useSession } from "next-auth/react";
// import { usePathname } from "next/navigation";
import { Search, Bell, User, Sidebar, SidebarOpen } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"; // Standard shadcn dropdown
import { signOut } from "next-auth/react";
import { Input } from "../ui/input";
import { ModeToggle } from "../shared/theme-toggle";
import Link from "next/link";
import { useSidebarStore } from "@/store/useSidbarStore";
import { Button } from "../ui/button";

const DashboardNavbar = () => {
  const { data: session } = useSession();
  // const pathname = usePathname();
  
  // Logic to create a readable title from the URL (e.g., /buyer/favorites -> Favorites)
  // const getPageTitle = () => {
  //   const segment = pathname.split("/").pop();
  //   if (!segment || segment === "buyer" || segment === "agent") return "Overview";
  //   return segment.charAt(0).toUpperCase() + segment.slice(1).split("-").join(" ");
  // };
  
  const { toggleSidebar, isCollapsed } = useSidebarStore();

  return (
    <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card px-8 py-10">
      {/* 1. Page Title & Search */}
      <div className="flex items-center gap-8">

        {/* Sidebar toggle button */}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isCollapsed ? <SidebarOpen size={24} /> : <Sidebar size={24} />}
        </Button>

        {/* Page title */}
        {/* <h1 className="text-xl font-semibold text-foreground hidden md:block">
          {getPageTitle()}
        </h1> */}
        
        {/* Search bar */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Search properties..." className="w-72 border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"/>
        </div>
      </div>

      {/* 2. Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Theme Switch */}
        <ModeToggle />

        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error border-2 border-foreground"></span>
        </button>

        <div className="h-8 w-0.5 bg-border mx-2"></div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 group">
              <div className="md:flex flex-col items-end hidden sm:flex">
                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                  {session?.user?.name?.split(" ").map((name) => name.charAt(0).toUpperCase() + name.slice(1)).join(" ") || "User"}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Agent
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border group-hover:border-primary transition-all">
                <User size={20} className="text-primary" />
              </div>
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
                <Link href="/settings">
                    Profile Settings
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-error cursor-pointer focus:text-error" 
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default DashboardNavbar;