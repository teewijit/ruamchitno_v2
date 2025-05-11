"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputWithLabel } from "@/components/inputs/input-label";
import { SelectWithLabel } from "@/components/inputs/select-label";
import { Card, CardContent } from "@/components/ui/card";
import { roles, statuses } from "../(table)/data";
import { CheckboxWithStatus } from "@/components/inputs/checkbox-status";
import { z } from "zod";
import { insertUserSchema, InsertUserSchemaType, SelectUserSchemaType } from "@/zod-schema/client/user.client.schema";
import { updateUserSchema } from "@/zod-schema/server/user.server.schema";

const formSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string(),
    p_name: z.string(),
    f_name: z.string(),
    l_name: z.string(),
    role: z.string(),
    status: z.string(),
})

type FormSchemaType = z.infer<typeof formSchema>;

type Props = {
    user?: SelectUserSchemaType,
    onSubmit: (data: InsertUserSchemaType) => void,
    isLoading?: boolean,
    mode: "create" | "edit",
};

export default function UserForm({ user, onSubmit, isLoading = false, mode }: Props) {
    const schema = mode === "create" ? insertUserSchema : updateUserSchema;
    type FormSchemaType = typeof schema extends z.ZodTypeAny ? z.infer<typeof schema> : never;

    const form = useForm<FormSchemaType>({
        defaultValues: user ?? {
            username: '',
            password: '',
            email: '',
            p_name: '',
            f_name: '',
            l_name: '',
            role: 'user',
            status: 'active',
        },
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    const handleSubmit = (data: any) => {
        // remove empty password on edit mode
        if (mode === "edit" && data.password === "") {
            delete data.password;
        }
        onSubmit(data);
    };


    return (
        <Card className="rounded-lg border-none mt-6">
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <InputWithLabel<SelectUserSchemaType> fieldTitle="ชื่อผู้ใช้งาน" nameInSchema="username" disabled={mode === "edit"} />
                        {mode === "create" && (
                            <InputWithLabel<SelectUserSchemaType> fieldTitle="รหัสผ่าน" nameInSchema="password" isPassword={true} />
                        )}
                        <InputWithLabel<SelectUserSchemaType> fieldTitle="อีเมล" nameInSchema="email" />

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-2">
                                <InputWithLabel<SelectUserSchemaType>
                                    fieldTitle="คำนำหน้า"
                                    nameInSchema="p_name"
                                />
                            </div>

                            <div className="col-span-5">
                                <InputWithLabel<SelectUserSchemaType>
                                    fieldTitle="ชื่อจริง"
                                    nameInSchema="f_name"
                                />
                            </div>

                            <div className="col-span-5">
                                <InputWithLabel<SelectUserSchemaType>
                                    fieldTitle="นามสกุล"
                                    nameInSchema="l_name"
                                />
                            </div>
                        </div>

                        <SelectWithLabel<SelectUserSchemaType> fieldTitle="บทบาท" nameInSchema="role" data={roles} />
                        <div className="grid grid-cols-4 gap-4">
                            <CheckboxWithStatus<SelectUserSchemaType> fieldTitle="สถานะ" nameInSchema="status" message="ใช้งาน" />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                            {isLoading ? (mode === "create" ? 'กำลังบันทึก...' : 'กำลังอัปเดต...')
                                : (mode === "create" ? 'บันทึกข้อมูล' : 'อัปเดตข้อมูล')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
