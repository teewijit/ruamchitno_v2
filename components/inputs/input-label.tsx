"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { PasswordInput } from "./password-input";

type Props<S> = {
    fieldTitle: string;
    nameInSchema: keyof S & string;
    className?: string;
    isPassword?: boolean; // 👈 เพิ่มตัวเลือกนี้
} & InputHTMLAttributes<HTMLInputElement>;

export function InputWithLabel<S>({
    fieldTitle,
    nameInSchema,
    className,
    isPassword = false, // 👈 ตั้ง default เป็น false
    ...props
}: Props<S>) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base" htmlFor={nameInSchema}>
                        {fieldTitle}
                    </FormLabel>

                    <FormControl>
                        {isPassword ? (
                            <PasswordInput
                                id={nameInSchema}
                                className={`${className}`}
                                {...props}
                                {...field}
                            />
                        ) : (
                            <Input
                                id={nameInSchema}
                                className={`${className}`}
                                {...props}
                                {...field}
                            />
                        )}
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
