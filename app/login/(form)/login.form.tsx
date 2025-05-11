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
import { loginUserSchema, LoginUserSchemaType } from "@/zod-schema/client/user.client.schema"

export function LoginForm() {
    const router = useRouter();

    const form = useForm<LoginUserSchemaType>({
        resolver: zodResolver(loginUserSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    function onSubmit(values: LoginUserSchemaType) {
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
                        <InputWithLabel
                            fieldTitle="Username"
                            nameInSchema="username"
                        />
                        <InputWithLabel
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
