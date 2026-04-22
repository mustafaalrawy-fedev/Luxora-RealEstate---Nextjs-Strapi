import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyDetails from "@/types/property";
import { CheckCircle2, XCircle, Clock, Construction } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AvailabilityStatusToggle = ({property, isUpdating, onUpdate}: {property: PropertyDetails, isUpdating: boolean, onUpdate: (id: string, status: string) => void}) => {
return (
    <Select
      disabled={isUpdating}
      defaultValue={property?.availability_status}
      onValueChange={(newValue) => onUpdate(property.documentId, newValue)}
    >
      <SelectTrigger className="w-[140px] h-8 text-xs font-medium border-none bg-background hover:bg-background transition-colors cursor-pointer">
        <SelectValue>
          <div className="flex items-center gap-2">
            {getStatusIcon(property?.availability_status)}
            <span>{property?.availability_status || "Select Status"}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <Tooltip>
          <TooltipTrigger asChild> 
            <SelectItem value="Available">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-success"/> Available
              </div>
            </SelectItem>
          </TooltipTrigger>
          <TooltipContent className="bg-card border border-foreground">
            <p className="text-foreground text-xs">Mark as Available, will show in Properties Page</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild> 
            <SelectItem value="Sold">
              <div className="flex items-center gap-2">
                <XCircle size={14} className="text-destructive"/> Sold
              </div>
            </SelectItem>
          </TooltipTrigger>
          <TooltipContent className="bg-card border border-foreground">
            <p className="text-foreground text-xs">Mark as Sold, will hide from Properties Page</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild> 
            <SelectItem value="Rented">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-orange-500"/> Rented
              </div>
            </SelectItem>
          </TooltipTrigger>
          <TooltipContent className="bg-card border border-foreground">
            <p className="text-foreground text-xs">Mark as Rented, will hide from Properties Page</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild> 
            <SelectItem value="Off-plan">
              <div className="flex items-center gap-2">
                <Construction size={14} className="text-blue-500"/> Off-plan
              </div>
            </SelectItem>
          </TooltipTrigger>
          <TooltipContent className="bg-card border border-foreground">
            <p className="text-foreground text-xs">Mark as Off-plan, will show in Properties Page</p>
          </TooltipContent>
        </Tooltip>
      </SelectContent>
    </Select>
  );
};

// دالة مساعدة للأيقونات
const getStatusIcon = (status: string | undefined) => {
  switch (status) {
    case "Available": return <CheckCircle2 size={14} className="text-success" />;
    case "Sold": return <XCircle size={14} className="text-destructive" />;
    case "Rented": return <Clock size={14} className="text-orange-500" />;
    case "Off-plan": return <Construction size={14} className="text-blue-500" />;
    default: return null;
  }
};

export default AvailabilityStatusToggle