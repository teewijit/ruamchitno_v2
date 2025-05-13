"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputWithLabel } from "@/components/inputs/input-label";
import { SelectWithLabel } from "@/components/inputs/select-label";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { BackButton } from '@/components/ui/back-button';
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { roles } from "@/components/table/data";

const insertSchema = z.object({
    username: z.string()
        .min(1, "กรุณากรอกชื่อผู้ใช้")
        .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร"),
    password: z.string()
        .min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร")
        .max(255, "รหัสผ่านต้องไม่เกิน 255 ตัวอักษร"),
    email: z.string()
        .min(1, "กรุณากรอก Email")
        .email("กรุณากรอก Email ให้ถูกต้อง"),
    p_name: z.string(),
    f_name: z.string(),
    l_name: z.string(),
    role: z.string(),
})

const updateSchema = z.object({
    username: z.string()
        .min(1, "กรุณากรอกชื่อผู้ใช้")
        .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร"),
    email: z.string()
        .min(1, "กรุณากรอก Email")
        .email("กรุณากรอก Email ให้ถูกต้อง"),
    p_name: z.string(),
    f_name: z.string(),
    l_name: z.string(),
    role: z.string(),
})

type InsertSchemaType = z.infer<typeof insertSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

type Props = {
    user?: InsertSchemaType | UpdateSchemaType,
    isLoading?: boolean,
    mode: "create" | "edit",
    onSubmit: (data: InsertSchemaType | UpdateSchemaType) => void
};

const FormSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2 space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="col-span-10 space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            <div className="space-y-2">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2 space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="col-span-5 space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="col-span-5 space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-6 w-6" />
                </div>
            </div>

            <Skeleton className="h-10 w-full" />
        </div>
    )
}

export default function UserForm({ user, isLoading = false, mode, onSubmit }: Props) {
    const schema = mode === "create" ? insertSchema : updateSchema;

    const form = useForm<InsertSchemaType | UpdateSchemaType>({
        defaultValues: user ?? {
            username: '',
            password: '',
            email: '',
            p_name: '',
            f_name: '',
            l_name: '',
            role: 'user',
        },
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    useEffect(() => {
        if (user) {
            form.reset(user);
            console.log(user);
            
        }
    }, [user]);

    const handleSubmit = async (data: InsertSchemaType | UpdateSchemaType) => {
        onSubmit(data);
    };

    return (
        <Card className="rounded-lg border-none mt-6">
            <CardContent>
                {isLoading ? (
                    <FormSkeleton />
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12 md:col-span-2">
                                    <SelectWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="บทบาท"
                                        nameInSchema="role"
                                        data={roles}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-10">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="ชื่อผู้ใช้งาน"
                                        nameInSchema="username"
                                    />
                                </div>
                            </div>

                            {mode === "create" && (
                                <InputWithLabel<InsertSchemaType> fieldTitle="รหัสผ่าน" nameInSchema="password" isPassword={true} />
                            )}
                            <InputWithLabel<InsertSchemaType | UpdateSchemaType> fieldTitle="อีเมล" nameInSchema="email" />

                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-4 md:col-span-2">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="คำนำหน้า"
                                        nameInSchema="p_name"
                                    />
                                </div>

                                <div className="col-span-8 md:col-span-5">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="ชื่อจริง"
                                        nameInSchema="f_name"
                                    />
                                </div>

                                <div className="col-span-12 md:col-span-5">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="นามสกุล"
                                        nameInSchema="l_name"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <BackButton title="ย้อนกลับ" variant={"outline"} />
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    variant={"default"}
                                >
                                    {isLoading
                                        ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    )
}