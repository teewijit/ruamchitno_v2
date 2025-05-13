import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { classes } from "@/db/schema/class.schema";
import { AuthGuard } from "@/lib/auth-guard";
import { and, count, desc, eq, ilike, ne, or, sql } from "drizzle-orm";

export const GET = AuthGuard(async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") ?? null;
        const page = parseInt(searchParams.get("page") ?? "1");
        const totalItems = parseInt(searchParams.get("totalItems") ?? "50");

        const searchCondition = search
            ? or(
                ilike(classes.name, `%${search}%`),
                ilike(classes.short_name, `%${search}%`),
                ilike(classes.class_level, `%${search}%`),
            )
            : undefined;

        const [{ count: totalCount }] = await db
            .select({ count: count() })
            .from(classes)
            .where(searchCondition);

        const totalPages = Math.ceil(totalCount / totalItems);
        const currentPage = search ? 1 : page;
        const offset = (currentPage - 1) * totalItems;

        const items = await db
            .select()
            .from(classes)
            .where(searchCondition)
            .orderBy(
                classes.id
            )
            .offset(offset)
            .limit(totalItems);

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
