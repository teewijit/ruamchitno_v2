import {
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputWithLabel } from "@/components/inputs/input-label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const passwordSchema = z
    .object({
        password: z
            .string()
            .min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร")
            .max(255, "รหัสผ่านต้องไม่เกิน 255 ตัวอักษร"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "รหัสผ่านไม่ตรงกัน",
        path: ["confirmPassword"],
    });

export type PasswordSchemaType = z.infer<typeof passwordSchema>;

type Props = {
    data?: PasswordSchemaType,
    isLoading?: boolean,
    onSubmit: (data: PasswordSchemaType) => void,
    onCancel?: () => void
};

export default function ChangePasswordForm({ data, isLoading = false, onSubmit, onCancel }: Props) {

    const form = useForm<PasswordSchemaType>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        mode: "onChange"
    });

    useEffect(() => {
        form.reset(data ?? {
            password: "",
            confirmPassword: "",
        });
    }, [data, form]);

    const handleSubmit = async (data: PasswordSchemaType) => {
        // ส่งข้อมูลไปยัง onSubmit หลังจากผ่านการตรวจสอบ
        if (!form.formState.isValid) {
            return; // หากฟอร์มไม่ผ่านการตรวจสอบ จะไม่ทำอะไร
        }
        onSubmit(data); // ส่งข้อมูล
    };

    return (
        <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
                <InputWithLabel<PasswordSchemaType>
                    fieldTitle="รหัสผ่านใหม่"
                    nameInSchema="password"
                    isPassword
                />
                <InputWithLabel<PasswordSchemaType>
                    fieldTitle="ยืนยันรหัสผ่าน"
                    nameInSchema="confirmPassword"
                    isPassword
                />

                <AlertDialogFooter>
                    <AlertDialogCancel type="button" onClick={onCancel} disabled={isLoading}>
                        ยกเลิก
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                            {isLoading ? "กำลังดำเนินการ..." : "ยืนยัน"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </form>
        </Form>
    );
}
