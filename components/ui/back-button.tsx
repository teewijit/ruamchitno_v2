"use client"

import { ButtonHTMLAttributes } from "react"
import { Button } from "./button"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

type Props = {
    title?: string,
    className?: string,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined,
} & ButtonHTMLAttributes<HTMLButtonElement>

export function BackButton(
    { title, variant, className, ...props }: Props
) {
    const router = useRouter()

    return (
        <Button
            type="button"
            variant={variant}
            className={className}
            onClick={() => router.back()}
        ><ChevronLeft /> {title}</Button>
    )
}