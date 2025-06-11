import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq, desc, and } from "drizzle-orm";
import { auditLogs } from "@/db/schema/audit-log.schema";
import { users } from "@/db/schema/user.schema";

export async function GET(
    req: NextRequest
) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const table = searchParams.get("table");

    try {
        const logs = await db
            .select({
                id: auditLogs.id,
                table: auditLogs.table_name,
                action: auditLogs.action,
                recordId: auditLogs.record_id,
                performedAt: auditLogs.performed_at,
                performedBy: {
                    id: users.id,
                    name: users.full_name,
                    email: users.email,
                },
            })
            .from(auditLogs)
            .leftJoin(users, eq(auditLogs.performed_by, users.id))
            .where(
                and(
                    eq(auditLogs.record_id, parseInt(id ?? '0')),
                    eq(auditLogs.table_name, table ?? '')
                )
            )
            .orderBy(desc(auditLogs.performed_at));

        return NextResponse.json(logs);
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
