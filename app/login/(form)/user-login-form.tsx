"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
} from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { InputWithLabel } from "@/components/inputs/input-label"
import { LoginUserSchemaType } from "@/zod-schema/user.zod"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    username: z.string().min(2, {
        message: "กรุณากรอก Usernaem อย่างน้อย 2 ตัวอักษร",
    }),
    password: z.string().min(4, "กรุณากรอกรหัสผ่านอย่างน้อย 4 ตัวอักษร"),
})

export default function UserFormLoginPage() {
    const router = useRouter();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const loading = toast.loading("กำลังเข้าสู่ระบบ...");

        try {
            const result = await signIn("credentials", {
                username: values.username,
                password: values.password,
                redirect: false, // ต้องใช้ false เพื่อจัดการ redirect เอง
            });

            if (result?.ok) {
                toast.success("เข้าสู่ระบบสำเร็จ");
                router.push(`/admin/user`);
            } else {
                toast.error("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
            }
        } catch (err) {
            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
        } finally {
            toast.dismiss(loading);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Card className="w-[400px]">
                        <CardHeader>
                            <CardTitle className="text-center text-3xl">มูลนิธิร่วมจิตต์น้อมเกล้าฯ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-3">
                                <InputWithLabel<LoginUserSchemaType>
                                    fieldTitle="Username"
                                    nameInSchema="username"
                                />
                            </div>

                            <div>
                                <InputWithLabel<LoginUserSchemaType>
                                    fieldTitle="Password"
                                    nameInSchema="password"
                                    isPassword={true}
                                />
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button type="submit">เข้าสู่ระบบ</Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    )
}
