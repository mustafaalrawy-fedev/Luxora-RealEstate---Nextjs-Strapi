"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import qs from "qs";

const PerformanceChart = () => {
    const {data: session} = useSession();

    const propertyQuery = qs.stringify({
        filters: {
            agent: {
                id: {
                    $eq: session?.user?.id ? Number(session?.user?.id) : undefined,
                },
            },
        },
        populate: {
            agent: true
        },
    }, { encodeValuesOnly: true });
    
  // 1. Fetch Properties
  const { data: propertiesData, isLoading: propsLoading } = useQuery({
    queryKey: ["agent-properties-stats", session?.user?.id],
    queryFn: async () => (await axiosInstance.get(`/properties?${propertyQuery}`)).data.data,
  });


  const inquiryQuery = qs.stringify({
    filters: {
        agent: {
            id: {
                $eq: session?.user?.id ? Number(session?.user?.id) : undefined,
            },
        },
    },
    populate: {
        agent: true
    },
}, { encodeValuesOnly: true });

  // 2. Fetch Inquiries (Structure this once you create the collection)
  const { data: inquiriesData, isLoading: inqLoading } = useQuery({
    queryKey: ["agent-inquiries-stats", session?.user?.id],
    queryFn: async () => (await axiosInstance.get(`/inquiries?${inquiryQuery}`)).data.data,
  });

  // 3. Transform & Group Data by Month
  const chartData = useMemo(() => {
    if (!propertiesData || !inquiriesData) return [];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const stats: Record<string, { name: string; properties: number; inquiries: number }> = {};

    // Initialize the last 6 months (or full year)
    months.forEach((m) => {
      stats[m] = { name: m, properties: 0, inquiries: 0 };
    });

    // Count Properties per month
    propertiesData.forEach((item: {createdAt: string}) => {
      const month = new Date(item.createdAt).toLocaleString("default", { month: "short" });
      if (stats[month]) stats[month].properties++;
    });

    // Count Inquiries per month
    inquiriesData.forEach((item: {createdAt: string}) => {
      const month = new Date(item.createdAt).toLocaleString("default", { month: "short" });
      if (stats[month]) stats[month].inquiries++;
    });

    return Object.values(stats);
  }, [propertiesData, inquiriesData]);

  if (propsLoading || inqLoading) return <div className="h-[300px] flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <Card className="lg:col-span-4 border-none shadow-sm bg-card/50 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold">Performance Insights</CardTitle>
          <p className="text-xs text-muted-foreground">Monthly growth of listings vs leads</p>
        </div>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Properties
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary" /> Inquiries
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)"  stopOpacity={1} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--secondary)" stopOpacity={1} />
                  <stop offset="95%" stopColor="var(--secondary)" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  borderRadius: "12px", 
                  border: "1px solid var(--border)" 
                }} 
              />
              <Area
                type="monotone"
                dataKey="properties"
                stroke="var(--primary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPrimary)"
              />
              <Area
                type="monotone"
                dataKey="inquiries"
                stroke="var(--secondary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSecondary)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;