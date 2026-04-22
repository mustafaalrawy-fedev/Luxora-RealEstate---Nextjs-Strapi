// hooks/use-agent-inquiries.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import qs from "qs";
import { useState, useMemo } from "react";

export const useAgentInquiries = () => {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  // استخدام useMemo لضمان عدم إعادة بناء الـ query إلا عند تغير البحث أو المستخدم
  const query = useMemo(() => {
    return qs.stringify({
      filters: {
        property: {
          agent: { id: { $eq: session?.user?.id } }
        },
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
  }, [session?.user?.id, searchTerm]);

  const { data: inquiries, isLoading, error, refetch } = useQuery({
    queryKey: ["agent-inquiries", session?.user?.id, searchTerm],
    queryFn: async () => {
      const res = await axiosInstance.get(`/inquiries?${query}`);
      return res.data.data;
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 دقائق لجعل التنقل سريعاً
  });

  console.log(inquiries)

  return { 
    inquiries, 
    isLoading, 
    error, 
    setSearchTerm, 
    searchTerm,
    refetch 
  };
};