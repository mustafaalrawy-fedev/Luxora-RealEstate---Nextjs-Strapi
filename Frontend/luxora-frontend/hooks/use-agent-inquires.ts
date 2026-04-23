// hooks/use-agent-inquiries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import qs from "qs";
import { useState, useMemo } from "react";
import { toast } from "sonner";

// __________________ get agent inquiries ________________________

export const useAgentInquiries = () => {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // استخدام useMemo لضمان عدم إعادة بناء الـ query إلا عند تغير البحث أو المستخدم
  const query = useMemo(() => {
    return qs.stringify({
      filters: {
        property: {
          agent: { id: { $eq: session?.user?.id } }
        },
        ...(statusFilter !== "All" ? { inquiry_status: { $eq: statusFilter } } : {}),
        ...(searchTerm ? {
          $or: [
            { full_name: { $containsi: searchTerm } }, // استخدام $containsi لتجاهل حالة الأحرف Case-insensitive
            { property: { property_name: { $containsi: searchTerm } } }
          ]
        } : {})
      },
      populate: ["property", "property.featured_image"],
      sort: ["createdAt:desc"],
    }, { encodeValuesOnly: true });
  }, [session?.user?.id, searchTerm, statusFilter]);

  const { data: inquiries, isLoading, error, refetch } = useQuery({
    queryKey: ["agent-inquiries", session?.user?.id, searchTerm, statusFilter],
    queryFn: async () => {
      const res = await axiosInstance.get(`/inquiries?${query}`);
      return res.data.data;
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 دقائق لجعل التنقل سريعاً
  });

  // console.log(inquiries)

  return { 
    inquiries, 
    isLoading, 
    error, 
    setSearchTerm, 
    searchTerm,
    setStatusFilter,
    statusFilter,
    refetch 
  };
};

// ________________________________________________________________________________

// __________________ Update Agent Inquiry Status ________________________

export const useUpdateAgentInquiryStatus = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async ({ documentId, newStatus }: { documentId: string; newStatus: string }) => {
      const res = await axiosInstance.put(`/inquiries/${documentId}`, 
        { data: { inquiry_status: newStatus } },
        { 
          headers: { 
            Authorization: `Bearer ${session?.user.jwt}` 
          } 
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["agent-inquiries", session?.user?.id] // refetch the inquiries data
      });
      toast.success("Status updated successfully ✓");
    },
    onError: (error: {response: {data: {error: {message: string}}}}) => {
      console.log(error)
      toast.error(error.response?.data?.error?.message ?? "Failed to update inquiry status ✗");
    }
  });

  return { updateStatus, isPending };
};

// ________________________________________________________________________________________________________