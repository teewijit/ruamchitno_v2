import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { youths } from "@/db/schema/youth.schema";
import { classes } from "@/db/schema/class.schema";
import { AuthGuard } from "@/lib/auth-guard";
import { and, count, desc, eq, ilike, ne, or, sql } from "drizzle-orm";
import { insertYouthSchema } from "@/zod-schema/youth.zod";
import { logAction } from "@/lib/audit-logs";
import {
    getFullAddress,
} from '@/services/location.service';

export const GET = AuthGuard(async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") ?? null;
        const page = parseInt(searchParams.get("page") ?? "1");
        const totalItems = parseInt(searchParams.get("totalItems") ?? "10");
        const offset = (page - 1) * totalItems;

        const searchCondition = search
            ? or(
                ilike(youths.p_name, `%${search}%`),
                ilike(youths.f_name, `%${search}%`),
                ilike(youths.l_name, `%${search}%`),
                ilike(classes.short_name, `%${search}%`),
                ilike(youths.address, `%${search}%`),
                ilike(youths.tambon, `%${search}%`),
                ilike(youths.amphoe, `%${search}%`),
                ilike(youths.province, `%${search}%`),
                ilike(youths.zip_code, `%${search}%`),
                ilike(youths.year_start, `%${search}%`),
                ilike(youths.remark, `%${search}%`),
            )
            : undefined;

        const whereCondition = searchCondition
            ? and(ne(youths.status, "delete"), searchCondition)
            : ne(youths.status, "delete");

        // นับจำนวนรวมก่อน
        const [{ count: totalCount }] = await db
            .select({ count: count() })
            .from(youths)
            .leftJoin(classes, eq(youths.class_id, classes.id))  // ทำการ JOIN ระหว่าง youths และ classes
            .where(whereCondition);

        const totalPages = Math.ceil(totalCount / totalItems);

        // ดึงข้อมูล พร้อมการ JOIN
        const result = await db
            .select({
                youth: youths,
                classes: classes,
            })
            .from(youths)
            .leftJoin(classes, eq(youths.class_id, classes.id))
            .where(whereCondition)
            .orderBy(
                sql`CASE WHEN ${youths.status} = 'active' THEN 0 ELSE 1 END`,
                desc(youths.create_at)
            )
            .offset(offset)
            .limit(totalItems)

        // แปลงผลลัพธ์ให้ classes ซ้อนอยู่ใน youth
        const items = result.map(({ youth, classes }) => ({
            ...youth,
            short_name: classes?.short_name,
            class_level: classes?.class_level,
        }))

        return NextResponse.json({
            items,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching youths:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
            { status: 500 }
        );
    }
});

export const POST = AuthGuard(async (req: NextRequest) => {

    try {
        const body = await req.json();

        const validData = insertYouthSchema.parse(body);

        const pname = validData.p_name ?? '';
        const fname = validData.f_name ?? '';
        const lname = validData.l_name ?? '';
        const fullname = `${pname}${fname} ${lname}`.trim();

        validData.full_name = fullname;
        
        const full_address = getFullAddress(validData.address ?? '', validData.tambon ?? 0, validData.amphoe ?? 0, validData.province ?? 0, validData.zip_code ?? '');
        validData.full_address = full_address;

        const result = await db.insert(youths).values(validData).returning();
        const newData = result[0];

        await logAction({
            table: "youths",
            action: "create",
            recordId: newData.id,
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: error },
            { status: 500 }
        );
    }
});