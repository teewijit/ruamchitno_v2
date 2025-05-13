import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DataObj = {
    label: string;
    value: number;
};

type Props<S> = {
    fieldTitle: string;
    nameInSchema: keyof S & string;
    data: DataObj[];
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (selected: DataObj | undefined) => void;
};

export function SelectWithSearch<S>({
    fieldTitle,
    nameInSchema,
    data,
    className,
    placeholder = "Please select...",
    disabled = false,
    onChange,
}: Props<S>) {
    const form = useFormContext();
    const [inputValue, setInputValue] = useState("");

    const lowerInput = inputValue.trim().toLowerCase();
    const filteredItems = data.filter((item) =>
        item.label.toLowerCase().includes(lowerInput)
    );

    return (
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({ field }) => {
                const selectedItem = data.find((item) => item.value === field.value);

                return (
                    <FormItem className={cn("w-full", className)}>
                        <FormLabel className="text-base" htmlFor={nameInSchema}>
                            {fieldTitle}
                        </FormLabel>
                        <FormControl>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            form.formState.errors[nameInSchema] &&
                                            "border-destructive ring-1 ring-destructive"
                                        )}
                                        disabled={disabled}
                                    >
                                        {selectedItem ? (
                                            selectedItem.label
                                        ) : (
                                            <span className="text-muted-foreground">
                                                {placeholder}
                                            </span>
                                        )}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="ค้นหา..."
                                            value={inputValue}
                                            onValueChange={setInputValue}
                                        />
                                        <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
                                        <ScrollArea>
                                            <CommandGroup className="max-h-[250px] overflow-y-auto">
                                                {filteredItems.map((item) => (
                                                    <CommandItem
                                                        key={item.value}
                                                        onSelect={() => {
                                                            field.onChange(item.value);
                                                            onChange?.(item); 
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                item.value === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {item.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </ScrollArea>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}