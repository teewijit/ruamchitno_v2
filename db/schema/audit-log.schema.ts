import { integer, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { db } from "..";

export const actionEnum = pgEnum('action', ['create', 'update', 'delete']);

export const auditLogs = pgTable("audit_logs", {
    id: serial("id").primaryKey(),
    table_name: varchar("table_name", { length: 100 }).notNull(),
    action: actionEnum("action").notNull(),
    record_id: integer("record_id").notNull(),
    performed_by: integer("performed_by").notNull(),
    performed_at: timestamp("performed_at", { withTimezone: true }).defaultNow(),
});

export async function logAction({
    table,
    action,
    recordId,
    userId,
}: {
    table: string;
    action: 'create' | 'update' | 'delete';
    recordId: number;
    userId: number;
}) {
    await db.insert(auditLogs).values({
        table_name: table,
        action,
        record_id: recordId,
        performed_by: userId,
    });
}
