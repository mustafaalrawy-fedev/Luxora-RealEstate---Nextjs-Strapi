"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, Phone, MessageSquare, MoreVertical, Search, Filter,
  CheckCircle2, Clock, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
// UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAgentInquiries } from "@/hooks/use-agent-inquires";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const InquiriesPage = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const { inquiries, isLoading, setSearchTerm, searchTerm, refetch } = useAgentInquiries();

  const getStatusBadge = (status: string) => {
    const styles = {
      new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      contacted: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      closed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    const current = status?.toLowerCase() || "pending";
    return (
      <Badge className={cn("rounded-full px-3 py-1 font-medium", styles[current as keyof typeof styles] || "bg-muted")}>
        {current.charAt(0).toUpperCase() + current.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Leads & Inquiries
          </h1>
          <p className="text-muted-foreground font-medium">Tracking and managing property engagement.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-2">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search leads or properties..." 
            className="pl-10 bg-card/40 border-border/50 focus:bg-card/80 transition-all rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto rounded-xl border-dashed">
          <Filter className="mr-2 h-4 w-4" /> Filter By Status
        </Button>
      </div>

      {/* Table Container */}
      <div className="rounded-[2rem] border bg-card/20 backdrop-blur-xl overflow-hidden shadow-2xl shadow-primary/5">
        <Table>
          <TableHeader className="bg-muted/30 backdrop-blur-md">
            <TableRow className="hover:bg-transparent border-b-border/50">
              <TableHead className="py-5 pl-8">Lead Information</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-32 text-muted-foreground animate-pulse">
                {/* Skeleton */}
                <p>Loading inquiries...</p> 
                </TableCell></TableRow>
            ) : inquiries?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-32">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <MessageSquare size={40} className="opacity-20" />
                    <p className="text-lg font-medium">{searchTerm ? "No matches found for your search." : "No inquiries yet."}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inq: {id: number, full_name: string, email: string, phone: string, inquiry_status: string, property: {property_name: string, slug: string, documentId: string}, createdAt: string, message: string}) => (
                <React.Fragment key={inq.id}>
                  <TableRow 
                    className={cn(
                      "group cursor-pointer transition-colors border-b-border/40",
                      expandedRow === inq.id ? "bg-primary/5" : "hover:bg-muted/40"
                    )}
                    onClick={() => setExpandedRow(expandedRow === inq.id ? null : inq.id)}
                  >
                    <TableCell className="py-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                          {inq.full_name.slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-base">{inq.full_name}</span>
                          <span className="text-xs text-muted-foreground">{inq.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold line-clamp-1">{inq.property?.property_name || "General"}</span>
                        <span className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">
                          {inq.property?.documentId?.slice(0,8)}
                        </span>
                      </div>
                    </TableCell>
                    {/* Inquiry Status Toggle */}
                    <TableCell>{getStatusBadge(inq.inquiry_status)}</TableCell>

                    <TableCell className="text-sm font-medium opacity-70">
                      {new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end items-center gap-2">
                        {expandedRow === inq.id ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-muted-foreground group-hover:text-foreground transition-colors" />}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Message Content */}
                  <AnimatePresence>
                    {expandedRow === inq.id && (
                      <TableRow className="bg-primary/2 hover:bg-primary/2 border-b-border/40">
                        <TableCell colSpan={5} className="p-0">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-8 py-6"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter">
                                  <MessageSquare size={14} /> Message Details
                                </div>
                                <p className="text-foreground/80 leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                                  &quot;{inq.message || "No message provided."}&quot;
                                </p>
                                <div className="flex gap-4 pt-2">
                                  <Button size="sm" className="rounded-full shadow-lg shadow-primary/20 gap-2">
                                    <Mail size={14} /> Reply via Email
                                  </Button>
                                  <Button size="sm" variant="outline" className="rounded-full">
                                    <Link href={`https://wa.me/${inq.phone}`} className="flex items-center gap-2">
                                      <Phone size={14} />
                                      <p className="text-sm"> Contact via WhatsApp</p>
                                    </Link>
                                  </Button>

                                  {/* Contact Via Phone */}
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button size="sm" variant="outline" className="rounded-full">
                                          <Link href={`tel:${inq.phone}`} className="flex items-center gap-2">
                                            <Phone size={14} />
                                            <p className="text-sm"> Contact via Phone</p>
                                          </Link>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-primary p-2">
                                        {/* Copy Phone in Clipboard - Later -*/}
                                        <p className="text-sm text-black tracking-wider">{inq.phone}</p> {/* i will add the number key via location that will be added in strapi */}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                              <div className="bg-background/50 rounded-2xl p-4 border border-border/50 space-y-3">
                                <p className="text-xs font-bold uppercase opacity-50">Quick Actions</p>
                                <div className="flex flex-col gap-2">
                                  <Button variant="ghost" size="sm" className="justify-start gap-2 h-9 px-3 rounded-lg hover:bg-primary/10">
                                    <CheckCircle2 size={14} className="text-success" /> Mark as Resolved
                                  </Button>
                                  {inq.property && (
                                    <Button variant="ghost" size="sm" className="justify-start h-9 px-3 rounded-lg hover:bg-primary/10 font-bold text-primary">
                                      <Link href={`/properties/${inq.property?.slug}`} className="flex items-center gap-2">
                                        <ExternalLink size={14} /> View Property
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InquiriesPage;