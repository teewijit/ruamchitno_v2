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
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
    username: z.string()
        .min(1, "กรุณากรอกชื่อผู้ใช้")
        .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร"),
    password: z.string()
        .min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร")
        .max(255, "รหัสผ่านต้องไม่เกิน 255 ตัวอักษร"),
})

type LoginSchemaType = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    function onSubmit(values: LoginSchemaType) {
        signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect: false,
        }).then((response) => {
            if (response?.error) {
                toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
            } else {
                router.push("admin/user")
                toast.success("เข้าสู่ระบบสำเร็จ");
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl">มูลนิธิร่วมจิตต์น้อมเกล้าฯ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InputWithLabel<LoginSchemaType>
                            fieldTitle="Username"
                            nameInSchema="username"
                            className="mb-3"
                        />
                        <InputWithLabel<LoginSchemaType>
                            fieldTitle="Password"
                            nameInSchema="password"
                            isPassword
                        />
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button type="submit">เข้าสู่ระบบ</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}
