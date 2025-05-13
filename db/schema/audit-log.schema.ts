import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { actionEnum } from "./enums.schema";

export const auditLogs = pgTable("audit_logs", {
    id: serial("id").primaryKey(),
    table_name: varchar("table_name", { length: 100 }).notNull(),
    action: actionEnum("action").notNull(),
    record_id: integer("record_id").notNull(),
    performed_by: integer("performed_by").notNull(),
    performed_at: timestamp("performed_at", { withTimezone: true }).defaultNow(),
});