"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface IComboBox {
  options: { value: any; label: string }[];
  placeholder: string;
  searchstring: string;
  emptystring: string;
  value: string;
  setValue: (value: string) => void;
}

const ComboBox: React.FC<IComboBox> = ({
  options,
  placeholder,
  searchstring,
  emptystring,
  value,
  setValue,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-52 justify-between font-normal whitespace-nowrap overflow-x-hidden text-ellipsis"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-0.5 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandInput placeholder={searchstring} />
          <CommandEmpty>{emptystring}</CommandEmpty>
          <CommandGroup className="overflow-y-auto h-60 scroll-p-0 scroll-m-0">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
