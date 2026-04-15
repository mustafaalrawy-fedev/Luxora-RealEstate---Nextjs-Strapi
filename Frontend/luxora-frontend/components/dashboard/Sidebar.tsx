"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LayoutDashboard, Home, Heart, PlusCircle, User, MessageCircle } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "../shared/Logo";

const Sidebar = () => {
  const { data: session } = useSession();
  const role = session?.user?.user_type;

  // Define links for both roles
  const links = [
    { 
      name: "Dashboard", 
      href: role === "Agent" ? "/agent" : "/buyer", 
      icon: LayoutDashboard,
      show: true 
    },
    { 
      name: "My Properties", 
      href: "/agent/properties", 
      icon: Home, 
      show: role === "Agent" 
    },
    { 
      name: "Add Property", 
      href: "/agent/add", 
      icon: PlusCircle, 
      show: role === "Agent" 
    },
    { 
      name: "My Favorites", 
      href: "/buyer/favorites", 
      icon: Heart, 
      show: role === "Buyer" 
    },
        { 
      name: "My Inquiries", 
      href: "/buyer/my-inquiries", 
      icon: MessageCircle, 
      show: role === "Buyer" 
    },
  ];

  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

//   console.log(session)

  return (
    <aside className="w-56 border-r min-h-screen flex flex-col gap-4 bg-card">
      
            {/* User profile section at bottom */}
      <div className="border-b p-8 flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
        {session?.user?.avatar ? (
          <Image src={session.user.avatar} alt="Profile" width={24} height={24} className="rounded-full" />
        ) : (
          <User size={24} className="text-primary" />
        )}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-bold truncate max-w-[120px]">{session?.user?.name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          link.show && (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn("flex items-center gap-3 hover:bg-accent transition-colors px-8 h-16", isActive(link.href) && "bg-accent border-r-4 border-primary")}
            >
              <link.icon size={20} />
              <span className="text-sm font-medium">{link.name}</span>
            </Link>
          )
        ))}
      </nav>

      {/* Logo */}
      <div className="mt-auto border-t py-5 flex items-center justify-center">
        <Logo />
      </div>
    </aside>
  );
};

export default Sidebar;