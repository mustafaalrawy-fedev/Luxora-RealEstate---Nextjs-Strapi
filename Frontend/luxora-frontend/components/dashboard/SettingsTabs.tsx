"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SettingsTabs = () => {
  const tabs = [
    { name: "Profile", href: "/settings" },
    { name: "Security", href: "/settings/security" },
    { name: "Notifications", href: "/settings/notifications" },
  ];

  const pathname = usePathname();
  const currentTab = tabs.find((tab) => tab.href === pathname);

  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line" className="w-full justify-start">
        {tabs.map((tab) => (
            <TabsTrigger key={tab.href} value={tab.href} className={cn("w-full", currentTab?.href === tab.href ? "text-primary" : "text-muted-foreground")}>
                <Link href={tab.href}>
                    {tab.name}
                </Link>
            </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>

  )
}

export default SettingsTabs