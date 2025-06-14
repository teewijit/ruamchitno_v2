import { NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema/user.schema";
import { and, count, desc, eq, ilike, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { AuthGuard } from "@/lib/auth-guard";
import bcrypt from 'bcryptjs'
import { insertUserSchema } from "@/zod-schema/user.zod";
import { logAction } from "@/lib/audit-logs";

async function getHandler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") ?? null;
        const page = parseInt(searchParams.get("page") ?? "1");
        const totalItems = parseInt(searchParams.get("totalItems") ?? "10");

        const searchCondition = search
            ? or(
                ilike(users.email, `%${search}%`),
                ilike(users.username, `%${search}%`),
                ilike(users.p_name, `%${search}%`),
                ilike(users.f_name, `%${search}%`),
                ilike(users.l_name, `%${search}%`)
            )
            : undefined;

        const whereCondition = searchCondition
            ? and(ne(users.status, 'delete'), searchCondition)
            : ne(users.status, 'delete');

        const [{ count: totalCount }] = await db
            .select({ count: count() })
            .from(users)
            .where(whereCondition);

        const totalPages = Math.ceil(totalCount / totalItems);
        const currentPage = search ? 1 : page;
        const offset = (currentPage - 1) * totalItems;

        const items = await db
            .select()
            .from(users)
            .where(whereCondition)
            .orderBy(
              // เรียงลำดับโดยให้ status = 'active' มาอยู่บนสุด
              sql`CASE WHEN ${users.status} = 'active' THEN 0 ELSE 1 END`,
              desc(users.create_at)  // ลำดับรอง: ตามวันที่สร้าง ใหม่ไปเก่า
            )
            .offset(offset)
            .limit(totalItems);

        return NextResponse.json({
            items,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน" },
            { status: 500 }
        );
    }
}

async function postHandler(req: NextRequest) {
    try {
        const body = await req.json();
        const validData = insertUserSchema.parse(body);

        // ตรวจสอบ username ซ้ำ
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.username, validData.username))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json(
                { message: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(validData.password, 10);
        validData.password = hashedPassword;
        
        const pname = validData.p_name ?? '';
        const fname = validData.f_name ?? '';
        const lname = validData.l_name ?? '';
        const full_name = `${pname}${fname} ${lname}`.trim();

        validData.full_name = full_name;

        const result = await db.insert(users).values(validData).returning();
        const newData = result[0];

        await logAction({
            table: "users",
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
}

export const GET = AuthGuard(getHandler);
export const POST = AuthGuard(postHandler);