import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/user.schema";
import { eq } from "drizzle-orm";
import { AuthGuard } from "@/lib/auth-guard";
import { updateUserSchema } from "@/zod-schema/server/user.server.schema";

async function getByHandler(
  req: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  try {
    const userId = context.params.id as string;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ message: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });
    }

    const userData = user[0];
    const { password, ...safeUserData } = userData;

    return NextResponse.json(safeUserData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" },
      { status: 500 }
    );
  }
}

export async function updateHandler(
  req: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  try {
    const userId = context.params.id as string;

    const body = await req.json();

    const validData = updateUserSchema.parse({
      ...body,
      user_id: userId,
    });

    const { p_name = "", f_name = "", l_name = "" } = validData;
    const fullname = `${p_name}${f_name} ${l_name}`.trim();

    validData.fullname = fullname;

    const { id, ...updateData } = validData;

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(userId)))
      .returning();

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export const GET = AuthGuard(getByHandler);
export const PUT = AuthGuard(updateHandler);
