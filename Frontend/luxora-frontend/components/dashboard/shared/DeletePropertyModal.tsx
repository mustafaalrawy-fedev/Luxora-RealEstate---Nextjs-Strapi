import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@radix-ui/react-dialog"
import { useDeleteProperty } from "@/hooks/use-delete-property"
import { cn } from "@/lib/utils"

const DeletePropertyModal = ({setOpen, propertyId, open}: {setOpen: (open: boolean) => void, propertyId: string | null, open: boolean}) => {

    const { isPending, handleConfirm } = useDeleteProperty({ setOpen });
  
    return (
    <Dialog open={open} onOpenChange={setOpen}>
  {/* <DialogTrigger>Open</DialogTrigger> */}
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="text-destructive text-xl mb-4">Are you absolutely sure?</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground mb-4">
        This action cannot be undone. This will permanently delete your property and remove it from our servers.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="gap-4 flex-row justify-center items-center">
      <DialogClose asChild>
        <Button variant="outline" className="flex-1">Cancel</Button>
      </DialogClose>
      <Button variant="destructive" className= {cn("flex-2", isPending && "cursor-not-allowed")} onClick={() => handleConfirm(propertyId!)} disabled={isPending}>
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default DeletePropertyModal