"use client";

import { 
  LayoutDashboard, 
  Plus, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PerformanceChart from "@/components/dashboard/shared/PerformanceCharts";
import DashboardStats from "@/components/dashboard/stats/DashboardStats";

const AgentDashboardPage = () => {

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Overview</h1>
          <p className="text-muted-foreground">Manage your properties and monitor listing performance.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="rounded-full px-6">
            <Link href="/agent/properties/add-property">
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"> */}
      <div className="grid gap-6 grid-cols-1">
        {/* Main Feed Section */}
        <PerformanceChart />

        {/* Activity Sidebar */}
        {/* <Card className="lg:col-span-3 border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-4 w-4" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.action}: <span className="text-muted-foreground font-normal">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-xs" asChild>
              <Link href="/agent/activities">View All Activities</Link>
            </Button>
          </CardContent>
        </Card> */}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickLink 
          title="My Properties" 
          desc="Edit, archive, or highlight listings." 
          href="/agent/properties" 
          color="bg-blue-500/10 text-blue-600"
        />
        <QuickLink 
          title="Leads & Inquiries" 
          desc="Manage customer communications." 
          href="/agent/inquiries" 
          color="bg-purple-500/10 text-purple-600"
        />
        <QuickLink 
          title="Profile Settings" 
          desc="Update your public agency brand." 
          href="/settings" 
          color="bg-amber-500/10 text-amber-600"
        />
      </div>
    </div>
  );
};

// Helper Component for Quick Links
const QuickLink = ({ title, desc, href, color }: { title: string, desc: string, href: string, color: string }) => (
  <Link href={href}>
    <div className="group p-6 rounded-2xl border bg-card hover:border-primary transition-all duration-300 shadow-sm cursor-pointer">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
        <LayoutDashboard size={20} />
      </div>
      <h3 className="font-bold group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </Link>
);

export default AgentDashboardPage;