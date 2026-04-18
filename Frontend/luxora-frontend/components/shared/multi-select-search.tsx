"use client";

import * as React from "react";
import { Check, Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Option {
  id: string | number;
  name: string;
}

interface SearchableMultiSelectProps {
  options: Option[];
  label: string;
  placeholder?: string;
  selectedValues: any[];
  onChange: (values: any[]) => void;
  error?: string;
}

// ... imports remain the same

export function SearchableMultiSelect({
  options = [],
  label,
  placeholder = "Select options...",
  selectedValues = [], // Ensure default empty array
  onChange,
  error,
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string | number) => {
    // BUG FIX: Normalize both to strings for reliable comparison
    const stringId = id.toString();
    const isSelected = selectedValues.some((v) => v.toString() === stringId);

    if (isSelected) {
      onChange(selectedValues.filter((v) => v.toString() !== stringId));
    } else {
      onChange([...selectedValues, stringId]);
    }
  };

  const removeValue = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // BUG FIX: Ensure strict string comparison
    const updatedValues = selectedValues.filter((v) => v.toString() !== id.toString());
    onChange(updatedValues);
  };

  return (
    <div className="space-y-2 flex flex-col w-full relative" ref={containerRef}>
      <label className="text-sm font-semibold">{label}</label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex min-h-12 w-full items-center justify-between rounded-xl border border-input bg-card/50 px-3 py-2 text-sm cursor-pointer transition-all",
          isOpen && "ring-2 ring-primary/20 border-primary/50",
          error && "border-destructive"
        )}
      >
        <div className="flex flex-wrap gap-1">
          {selectedValues.length > 0 ? (
            selectedValues.map((valId) => {
              const option = options.find((opt) => opt.id.toString() === valId.toString());
              if (!option) return null;

              return (
                <Badge
                  key={valId.toString()} // Ensure string key
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 py-0.5 flex items-center gap-1"
                >
                  {option.name}
                  <button
                    type="button"
                    onClick={(e) => removeValue(valId, e)}
                    className="rounded-full hover:bg-destructive hover:text-white transition-colors p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              );
            })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-xl border bg-popover text-popover-foreground shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <Command className="bg-transparent" shouldFilter={true}> 
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search..."
                className="h-10 border-none focus:ring-0 bg-transparent w-full"
                // Stop the click from closing the parent div
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
            <CommandList className="max-h-60 overflow-y-auto p-1">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id.toString()}
                    onSelect={() => handleSelect(option.id)}
                    className="rounded-lg cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-md border border-primary transition-all",
                        selectedValues.some(v => v.toString() === option.id.toString())
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {selectedValues.some(v => v.toString() === option.id.toString()) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <span className="flex-1">{option.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}