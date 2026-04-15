"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LayoutDashboard, Home, Heart, PlusCircle, User, MessageCircle, Settings } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "../shared/Logo";
import { useSidebarStore } from "@/store/useSidbarStore";
import { AnimatePresence, motion } from "framer-motion";

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
      href: "/agent/add-property", 
      icon: PlusCircle, 
      show: role === "Agent" 
    },
    {
      name: "Inquiries",
      href: "/agent/inquiries",
      icon: MessageCircle,
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
    { 
      name: "Settings", 
      href: "/settings", 
      icon: Settings,
      show: true,
    },
  ];

  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

//   console.log(session)

  const { isCollapsed } = useSidebarStore();

  return (
    <AnimatePresence mode="wait">
    <motion.aside 
    initial={{ width: 0 }}
    animate={{ width: isCollapsed ? 80 : 224 }}
    exit={{ width: 0 }}
    transition={{ duration: 0.5 }}
    className={`${isCollapsed ? "w-20" : "w-56"} sticky top-0 border-r max-h-screen flex flex-col gap-4 bg-card`}>
      
      {/* User profile section at bottom */}
      <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("border-b flex items-center gap-3 mb-8", isCollapsed ? "justify-center p-4" : "justify-start p-8")}>
        <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
        {session?.user?.avatar ? (
          <Image src={session.user.avatar} alt="Profile" width={24} height={24} className="rounded-full" />
        ) : (
          <User size={24} className="text-primary" />
        )}
        </motion.div>
        {!isCollapsed && (
        <div className="flex flex-col">
          <p className="text-sm font-bold truncate max-w-[120px]">{session?.user?.name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
        )}
      </motion.div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          link.show && (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn("flex items-center gap-3 hover:bg-accent transition-colors h-16", isActive(link.href) && "bg-accent border-r-4 border-primary", isCollapsed ? "justify-center px-4" : "justify-start px-8")}
            >
              <link.icon size={20} />
              <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={cn("text-sm font-medium whitespace-nowrap", isCollapsed ? "hidden" : "block")}>{link.name}</motion.span>
            </Link>
          )
        ))}
      </nav>

      {/* Logo */}
      <div className="mt-auto border-t py-5 flex items-center justify-center">
        <Link href="/">
            <Logo showText={!isCollapsed} />
        </Link>
      </div>
    </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;