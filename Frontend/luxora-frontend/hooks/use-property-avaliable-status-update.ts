import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const usePropertyAvailableStatusUpdate = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: updateStatus, isPending } = useMutation({
  mutationFn: async ({ documentId, newStatus }: { documentId: string; newStatus: string }) => {

    if (!session?.user.jwt) {
      router.push("/login");
      toast.error("You are not authorized to perform this action"); // please Login or refresh the page or register
      throw new Error("No session found");
    }

    return await axiosInstance.put(`/properties/${documentId}`, {
      data: { availability_status: newStatus } // تأكد أن الاسم في Strapi مطابق
    }, {
      headers: { "Authorization": `Bearer ${session?.user.jwt}` }
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['agent-properties'] });
    toast.success("Status updated successfully");
  },
  onError: (error: {response: {data: {error: {message: string}}}}) => {
    toast.error(error.response?.data?.error?.message ?? "Failed to update status");
  }
});

return { updateStatus, isPending };
}

export default usePropertyAvailableStatusUpdate