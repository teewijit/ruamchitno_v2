import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { youths } from "@/db/schema/youth.schema";
import { eq } from "drizzle-orm";
import { AuthGuard } from "@/lib/auth-guard";
import { logAction } from "@/lib/audit-logs";
import { updateYouthSchema } from "@/zod-schema/youth.zod";
import { getAmphoeById, getFullAddress, getProvinceById, getTambonById } from "@/services/location.service";

async function getHandler(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    const youth = await db
      .select()
      .from(youths)
      .where(eq(youths.id, parseInt(id)))
      .limit(1);

    if (!youth || youth.length === 0) {
      return NextResponse.json({ message: "ไม่พบข้อมูลเยาวชน" }, { status: 404 });
    }

    const youthData = youth[0];

    return NextResponse.json(youthData);
  } catch (error) {
    console.error("Error fetching youth:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูลเยาวชน" },
        { status: 500 }
    );
  }
}

async function putHandler(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: youthId } = await context.params;

    const body = await req.json();

    const validData = updateYouthSchema.parse({
      ...body,
      id: parseInt(youthId),
    });

    const { p_name = "", f_name = "", l_name = "" } = validData;
    const fullname = `${p_name}${f_name} ${l_name}`.trim();

    validData.full_name = fullname;

    const full_address = getFullAddress(validData.address ?? '', validData.tambon ?? 0, validData.amphoe ?? 0, validData.province ?? 0, validData.zip_code ?? '');
    validData.full_address = full_address;

    const { id, ...updateData } = validData;

    const result = await db
      .update(youths)
      .set(updateData)
      .where(eq(youths.id, parseInt(youthId)))
      .returning();
    const newData = result[0];

    await logAction({
      table: "youths",
      action: "update",
      recordId: newData.id,
    });

    return NextResponse.json(newData, { status: 200 });
  } catch (error) {
    console.error("Error updating youth:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

async function patchHandler(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: youthId } = await context.params;

    const body = await req.json();

    const validData = updateYouthSchema.parse({
      ...body,
      id: parseInt(youthId),
    });

    const { id, status } = validData; // ตรวจสอบ status จากข้อมูลที่ได้รับ
    const updateData: Partial<typeof validData> = { status }; // อัปเดตแค่ status เท่านั้น

    // อัปเดตข้อมูลเฉพาะ status ของผู้ใช้
    const result = await db
      .update(youths)
      .set(updateData)
      .where(eq(youths.id, parseInt(youthId)))
      .returning();
    const newData = result[0];

    // บันทึกการกระทำเฉพาะเมื่อสถานะเป็น 'delete'
    if (status === 'delete') {
      await logAction({
        table: "youths",
        action: 'delete',
        recordId: newData.id,
      });
    }

    return NextResponse.json({ message: `Youth status updated to ${status}` }, { status: 200 });

  } catch (error) {
    console.error("Error updating youth:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export const GET = AuthGuard(getHandler);
export const PUT = AuthGuard(putHandler);
export const PATCH = AuthGuard(patchHandler);
