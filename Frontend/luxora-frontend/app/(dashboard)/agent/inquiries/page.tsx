"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";
import qs from "qs";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  MoreVertical, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const InquiriesPage = () => {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Setup Query for Strapi v5
 const query = qs.stringify({
  filters: {
    agent: {
      id: { $eq: session?.user?.id ? Number(session.user.id) : undefined }
    },
    // ONLY add the $or filter if searchTerm has a value
    ...(searchTerm ? {
      $or: [
        { full_name: { $contains: searchTerm } },
        { property: { title: { $contains: searchTerm } } }
      ]
    } : {})
  },
  populate: ["property"],
  sort: ["createdAt:desc"],
}, { encodeValuesOnly: true });

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ["agent-inquiries", session?.user?.id, searchTerm],
    queryFn: async () => (await axiosInstance.get(`/inquiries?${query}`)).data.data,
    enabled: !!session?.user?.id,
  });

  console.log("Inquiries:", inquiries);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20"><Clock className="w-3 h-3 mr-1"/> New</Badge>;
      case "contacted":
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20"><MessageSquare className="w-3 h-3 mr-1"/> Contacted</Badge>;
      case "closed":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1"/> Closed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads & Inquiries</h1>
          <p className="text-muted-foreground">Manage incoming messages and property requests.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-xl border backdrop-blur-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads or properties..." 
            className="pl-10 bg-background/50 border-none ring-1 ring-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Inquiries Table */}
      <div className="rounded-2xl border bg-card/30 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Lead Information</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">Loading inquiries...</TableCell></TableRow>
            ) : inquiries?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">No inquiries found.</TableCell></TableRow>
            ) : (
              inquiries.map((inq: {id: number, full_name: string, email: string, property: {property_name: string, documentId: string}, status: string, createdAt: string}) => (
                <TableRow key={inq.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold">{inq.full_name}</span>
                      <span className="text-xs text-muted-foreground flex items-center mt-1">
                        <Mail className="w-3 h-3 mr-1" /> {inq.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium line-clamp-1">{inq.property?.property_name || "General Inquiry"}</p>
                      <p className="text-xs text-primary">ID: {inq.property?.documentId?.slice(0,8)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(inq.status)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Phone className="h-4 w-4 text-emerald-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InquiriesPage;