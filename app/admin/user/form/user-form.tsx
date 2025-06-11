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
import { useEffect, useState } from "react";
import { roles } from "@/components/table/data";
import Loading from "./loading";
import { optionsTitle } from "@/lib/titles";

const checkUsernameAvailable = async (username: string) => {
    if (!username || username.trim() === "") return true; // ว่าง = ถือว่า valid ไปก่อน

    const res = await fetch(`/api/user/check-username?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    return !data.exists;
};


const insertSchema = z.object({
    username: z.string()
        .min(1, "กรุณากรอกชื่อผู้ใช้")
        .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร")
        .refine(async (username) => {
            return await checkUsernameAvailable(username);
        }, {
            message: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว",
        }),
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
    onSubmit: (data: InsertSchemaType | UpdateSchemaType) => void,
    isSubmitting?: boolean
};

export default function UserForm({
    user,
    isLoading = false,
    mode, onSubmit,
    isSubmitting = false
}: Props) {
    const schema = mode === "create" ? insertSchema : updateSchema;
    const [originalData, setOriginalData] = useState<InsertSchemaType | UpdateSchemaType | null>(null);
    const [isFormReady, setIsFormReady] = useState(false);

    // ตั้งค่า default values
    const defaultValues = {
        username: '',
        password: '',
        email: '',
        p_name: '',
        f_name: '',
        l_name: '',
        role: 'user',
    };

    const form = useForm<InsertSchemaType | UpdateSchemaType>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    // จัดการข้อมูลเมื่อ user prop เปลี่ยน
    useEffect(() => {
        if (mode === "create") {
            // สำหรับ create mode
            form.reset(defaultValues);
            setOriginalData(defaultValues);
            setIsFormReady(true);
        } else if (mode === "edit") {
            if (user) {
                // สำหรับ edit mode เมื่อมีข้อมูล user
                console.log('Resetting form with user data:', user);
                form.reset(user);
                setOriginalData(user);
                setIsFormReady(true);
            } else {
                // รอข้อมูล user
                setIsFormReady(false);
            }
        }
    }, [user, mode, form]);

    // ตรวจสอบว่าข้อมูลมีการเปลี่ยนแปลงหรือไม่
    const watchedValues = form.watch();
    const hasChanges = () => {
        if (mode === "create") return true;
        if (!originalData) return false;
        return JSON.stringify(watchedValues) !== JSON.stringify(originalData);
    };

    const handleSubmit = async (data: InsertSchemaType | UpdateSchemaType) => {
        onSubmit(data);
    };

    // แสดง loading หากยังไม่พร้อม
    if (isLoading || !isFormReady) {
        return (
            <Card className="rounded-lg border-none mt-6">
                <CardContent>
                    <div className="flex justify-center items-center py-8">
                        <Loading />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // ตรวจสอบว่าปุ่มควรถูกปิดหรือไม่
    const isSaveDisabled = isSubmitting ||
        (mode === "edit" && !hasChanges()) ||
        !form.formState.isValid;

    return (
        <Card className="rounded-lg border-none mt-6">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-3 lg:col-span-2">
                                <SelectWithLabel<InsertSchemaType | UpdateSchemaType>
                                    fieldTitle="บทบาท"
                                    nameInSchema="role"
                                    data={roles}
                                    isRequired={true}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-9 lg:col-span-10">
                                <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                    fieldTitle="ชื่อผู้ใช้งาน"
                                    nameInSchema="username"
                                    isRequired={true}
                                    disabled={mode === "edit"}
                                />
                            </div>
                        </div>

                        {mode === "create" && (
                            <InputWithLabel<InsertSchemaType>
                                fieldTitle="รหัสผ่าน"
                                nameInSchema="password"
                                isPassword={true}
                                isRequired={true}
                            />
                        )}

                        <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                            fieldTitle="อีเมล"
                            nameInSchema="email"
                            isRequired={true}
                        />

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-4 md:col-span-3 xl:col-span-2">
                                <SelectWithLabel<InsertSchemaType | UpdateSchemaType>
                                    fieldTitle="คำนำหน้า"
                                    nameInSchema="p_name"
                                    placeholder="เลือกคำนำหน้า"
                                    data={optionsTitle}
                                />
                            </div>

                            <div className="col-span-8 md:col-span-4 xl:col-span-5">
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
                            <BackButton variant={"outline"} />
                            <Button
                                type="submit"
                                disabled={isSaveDisabled}
                                variant={isSaveDisabled ? "secondary" : "default"}
                                className={isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""}
                            >
                                {isSubmitting
                                    ? "กำลังบันทึก..."
                                    : mode === "edit" && !hasChanges()
                                        ? "ไม่มีการเปลี่ยนแปลง"
                                        : "บันทึกข้อมูล"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}