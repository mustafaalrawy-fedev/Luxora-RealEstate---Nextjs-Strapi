import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const InquiryStatusToggle = ({ 
  inquiry, 
  onUpdate, 
  isUpdating 
}: { 
  inquiry: { documentId: string, inquiry_status: string }, 
  onUpdate: (documentId: string, status: string) => void, 
  isUpdating: boolean 
}) => {
  const { documentId, inquiry_status } = inquiry;

  const statuses = ["New", "Contacted", "Closed"];

  return (
    <div className="grid grid-cols-3 gap-1 p-1 bg-muted/50 rounded-xl border border-border/40">
      {statuses.map((status) => (
        <Button
          key={status}
          size="sm"
          disabled={isUpdating}
          variant={inquiry_status === status ? "default" : "ghost"}
          onClick={() => onUpdate(documentId, status)}
          className={cn(
            "rounded-lg text-xs h-8 px-2 transition-all",
            inquiry_status === status ? "shadow-sm" : "hover:bg-background/50"
            // status === "New" ? "text-info" : "",
            // status === "Contacted" ? "text-success" : "",
            // status === "Closed" ? "text-error" : "",
          )}
        >
          {isUpdating && inquiry_status !== status ? (
             <span className="animate-pulse">...</span>
          ) : (
            status
          )}
        </Button>
      ))}
    </div>
  );
};

export default InquiryStatusToggle;