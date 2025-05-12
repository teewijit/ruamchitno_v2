import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema/user.schema";
import { AuthGuard } from "@/lib/auth-guard";
import bcrypt from 'bcryptjs'
import { passwordSchema } from "@/zod-schema/user.schema";

export async function patchHandler(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        // validate password
        const { password } = passwordSchema.parse(body);

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // update รหัสผ่านในฐานข้อมูล
        const result = await db
            .update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, parseInt(id)))
            .returning();

        if (!result.length) {
            return NextResponse.json({ message: "ไม่พบผู้ใช้งาน" }, { status: 404 });
        }

        return NextResponse.json({ message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "เกิดข้อผิดพลาด" },
            { status: 500 }
        );
    }
}

export const PATCH = AuthGuard(patchHandler);