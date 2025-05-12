import { db } from "@/db";
import { getAuthSession } from "./auth-session";
import { auditLogs } from "@/db/schema/audit-log.schema";

export async function logAction({
    table,
    action,
    recordId,
}: {
    table: string;
    action: 'create' | 'update' | 'delete';
    recordId: number;
}) {

    const session = await getAuthSession();

    let userId = 0
    if (session?.user?.id) {
        userId = parseInt(session?.user?.id)
    }

    await db.insert(auditLogs).values({
        table_name: table,
        action,
        record_id: recordId,
        performed_by: userId,
    });
}
