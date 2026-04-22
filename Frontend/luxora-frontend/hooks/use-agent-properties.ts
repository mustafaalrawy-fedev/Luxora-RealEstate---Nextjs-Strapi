import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import qs from "qs";
import { usePageChange } from "./use-page-change";

export const useAgentProperties = ({ filter = true, pageSizeAmount = 5 }: { filter?: boolean; pageSizeAmount?: number }) => {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page') ?? 1)
  const pageSize = pageSizeAmount

  const {data: session} = useSession();
  const profile = session?.user;

  const status = searchParams.get('status') as 'Sale' | 'Rent' | null;
  const type = searchParams.get('type') as string | null;
  const country = searchParams.get('country') as string | null;
  const city = searchParams.get('city') as string | null;
  const district = searchParams.get('district') as string | null;

  // Filters
  const filters: any = {
    agent: { id: profile?.id }
  };

  if (status) filters.property_status = { $eq: status };
  if (type) filters.property_type = { slug: { $eq: type } };

  // بناء فلتر المنطقة بتسلسل منطقي
  if (district) {
    filters.district = { slug: { $eq: district } };
  } else if (city) {
    filters.district = { city: { slug: { $eq: city } } };
  } else if (country) {
    filters.district = { city: { country: { slug: { $eq: country } } } };
  }
  
  const query = qs.stringify({
    populate: "*",
    pagination: {
      page: currentPage,
      pageSize: pageSize,
    },
    // filters: {
    //   agent: {
    //     id: profile?.id,
    //   },
    //   property_status: status? { $eq: status }: {},
    //   property_type: type? {slug: { $eq: type } }: {},
    //   district: {
    //     slug: district ? { $eq: district } : {},
    //     city: {
    //       slug: city ? { $eq: city } : {},
    //       country: { slug: country ? { $eq: country } : {} },
    //     },
    //   },
    // },
    ...(filter && { filters }),
    sort: 'createdAt:desc',
  }, {encodeValuesOnly: true})

  const {data, isLoading, error} = useQuery({
    // queryKey: ["agent-properties", page, profile?.id],
    queryKey: ["agent-properties", currentPage, profile?.id, status, type, country, city, district],
    queryFn: async() => {
        const res = await axiosInstance.get(`/properties?${query}`) // All properties
        return res.data
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60,
    // refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true, // Refetch when the user switches tabs back to your app
    refetchOnMount: true,       // Refetch every time the component loads
    })

    const properties = data?.data
    const meta = data?.meta?.pagination
    const totalPages = meta?.pageCount || 1

  const { handlePageChange } = usePageChange(searchParams); 

  return { properties, isLoading, error, totalPages, currentPage, handlePageChange, pageSize }
}