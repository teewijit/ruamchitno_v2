import { relations } from "drizzle-orm";
import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { auditLogs } from "./audit-log.schema";
import { roleEnum, statusEnum } from "./enums.schema";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    p_name: varchar("p_name", { length: 100 }),
    f_name: varchar("f_name", { length: 100 }),
    l_name: varchar("l_name", { length: 100 }),
    fullname: varchar("fullname", { length: 255 }),
    role: roleEnum("role").default("user").notNull(),
    status: statusEnum("status").default("active").notNull(),
    create_at: timestamp("create_at", { withTimezone: true }).defaultNow(),
    update_at: timestamp("update_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const userHistory = relations(users, 
    ({ many }) => ({ 
        auditLogs: many(auditLogs)
    })
)