import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from '../ui/select'

interface FilterSelectProps {
    label: string;
    options: {id: number, value: string, label: string, operator?: string}[];
    value: string;
    onValueChange: (value: string) => void;
}

const FilterSelect = ({label, options, value, onValueChange}: FilterSelectProps) => {
  return (
    <div className='w-full'>
          {/* <label htmlFor="status" className='block text-xs font-medium text-muted-foreground mb-2'>Status</label> */}
        <Select 
          value={value || ""}
          onValueChange={onValueChange}
        >
          <SelectTrigger className='w-full' size="lg">
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
             <SelectLabel>{label}</SelectLabel>
            {options?.map((opt: {id: number, value: string, label: string}) => (
              <SelectItem key={opt.id} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
  )
}

export default FilterSelect