import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/user.schema";
import { eq } from "drizzle-orm";
import { AuthGuard } from "@/lib/auth-guard";

export async function getHandler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json(
                { message: "กรุณาระบุ username" },
                { status: 400 }
            );
        }

        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        return NextResponse.json({
            exists: existingUser.length > 0
        });
    } catch (error) {
        console.error("Error checking username:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการตรวจสอบ username" },
            { status: 500 }
        );
    }
}

export const GET = AuthGuard(getHandler);