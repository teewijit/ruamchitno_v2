import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/user.schema";
import { eq } from "drizzle-orm";
import { AuthGuard } from "@/lib/auth-guard";
import { updateUserSchema } from "@/zod-schema/user.zod";
import { logAction } from "@/lib/audit-logs";

async function getHandler(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
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

export async function putHandler(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: userId } = await context.params;

    const body = await req.json();

    const validData = updateUserSchema.parse({
      ...body,
      id: parseInt(userId),
    });

    const { p_name = "", f_name = "", l_name = "" } = validData;
    const fullname = `${p_name}${f_name} ${l_name}`.trim();

    validData.full_name = fullname;

    const { id, ...updateData } = validData;

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(userId)))
      .returning();
    const newData = result[0];

    await logAction({
      table: "users",
      action: "update",
      recordId: newData.id,
    });

    return NextResponse.json(newData, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function patchHandler(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: userId } = await context.params;

    const body = await req.json();

    const validData = updateUserSchema.parse({
      ...body,
      id: parseInt(userId),
    });

    const { id, status } = validData; // ตรวจสอบ status จากข้อมูลที่ได้รับ
    const updateData: Partial<typeof validData> = { status }; // อัปเดตแค่ status เท่านั้น

    // อัปเดตข้อมูลเฉพาะ status ของผู้ใช้
    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(userId)))
      .returning();
    const newData = result[0];

    // บันทึกการกระทำเฉพาะเมื่อสถานะเป็น 'delete'
    if (status === 'delete') {
      await logAction({
        table: "users",
        action: 'delete',
        recordId: newData.id,
      });
    }

    return NextResponse.json({ message: `User status updated to ${status}` }, { status: 200 });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export const GET = AuthGuard(getHandler);
export const PUT = AuthGuard(putHandler);
export const PATCH = AuthGuard(patchHandler);
