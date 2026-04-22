import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export const useDeleteProperty = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    const {mutate, isPending} = useMutation({
        mutationFn: async(documentId: string) => {
            const res = await axiosInstance.delete(`/properties/${documentId}`, {
                headers: {
                    "Authorization": `Bearer ${session?.user.jwt}`,
                    "Content-Type": "application/json",
                },
            })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agent-properties'] });
            setOpen(false)
            toast.success("Property deleted successfully")
        },
        onError: () => {
            setOpen(false)
            toast.error("Failed to delete property")
        }
    })
    

    const handleConfirm = (documentId: string) => {
        if (!documentId) return toast.error("Property ID is required")
        mutate(documentId); 
    };

    return { isPending, handleConfirm }
}
