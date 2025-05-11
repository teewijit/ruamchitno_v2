import { NextRequest, NextResponse } from "next/server";
import { users } from "@/db/schema/user.schema";
import { count, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { AuthGuard } from "@/lib/auth-guard";
import bcrypt from 'bcryptjs'
import { insertUserSchema } from "@/zod-schema/server/user.server.schema";

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

        const [{ count: totalCount }] = await db
            .select({ count: count() })
            .from(users)
            .where(searchCondition);

        const totalPages = Math.ceil(totalCount / totalItems);
        const currentPage = search ? 1 : page;
        const offset = (currentPage - 1) * totalItems;

        const items = await db
            .select()
            .from(users)
            .where(searchCondition)
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

        const hashedPassword = await bcrypt.hash(validData.password, 10)
        validData.password = hashedPassword;

        const pname = validData.p_name ?? '';
        const fname = validData.f_name ?? '';
        const lname = validData.l_name ?? '';
        const fullname = `${pname}${fname} ${lname}`.trim();

        validData.fullname = fullname;

        const result = await db.insert(users).values(validData).returning();

        return NextResponse.json(result[0], { status: 201 });
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