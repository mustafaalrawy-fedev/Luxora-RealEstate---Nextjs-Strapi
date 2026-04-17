// @/hooks/use-profile.ts
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";
// import qs from "qs"


export const useProfile = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/${session?.user?.id}?populate=*`);
      const userData = res.data;

      if (userData?.properties) {
        userData.properties = userData.properties.filter(
          (prop: {publishedAt: string | null}) => prop.publishedAt !== null
        );
      }

      return userData;
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes
  });
};