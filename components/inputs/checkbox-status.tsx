"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

type Props<S> = {
    fieldTitle: string;
    nameInSchema: keyof S & string;
    message: string;
}

export function CheckboxWithStatus<S>({
    fieldTitle,
    nameInSchema,
    message,
}: Props<S>) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className="w-full flex items-center gap-2">
                    <FormLabel className="text-base w-1/4" htmlFor={nameInSchema}>
                        {fieldTitle}
                    </FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Checkbox
                                id={nameInSchema}
                                checked={field.value === "active"}  // ตรวจสอบว่าค่าเป็น "active" หรือไม่
                                onCheckedChange={(checked: boolean) => {
                                    field.onChange(checked ? "active" : "inactive"); // เปลี่ยนค่า e_status
                                }}
                            />
                        </FormControl>
                        {message}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
