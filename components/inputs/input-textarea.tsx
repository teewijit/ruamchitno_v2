import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "@/components/ui/textarea";

type Props<S> = {
    fieldTitle: string;
    nameInSchema: keyof S & string;
    className?: string;
} & InputHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaWithLabel<S>({
    fieldTitle, nameInSchema, className, ...props
}: Props<S>) {
    const form = useFormContext()

    return (
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className="mb-3">
                    <FormLabel className="text-base" htmlFor={nameInSchema}>
                        {fieldTitle}
                    </FormLabel>

                    <FormControl>
                        <Textarea
                            id={nameInSchema}
                            className={className}
                            {...props}
                            {...field}
                        />
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}