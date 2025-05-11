import { numeric, pgTable, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { funds } from "./fund.schema";

export const fundYearlyAmounts = pgTable("fund_yearly_amounts", {
    id: serial("id").primaryKey(),
    fund_id: integer("fund_id").references(() => funds.id).notNull(),
    year: varchar("year", { length: 4 }).notNull(),
    donated_amount: numeric("donated_amount", { precision: 15, scale: 2 }).default("0.00"),
    used_amount: numeric("used_amount", { precision: 15, scale: 2 }).default("0.00"),
    remaining_amount: numeric("remaining_amount", { precision: 15, scale: 2 }).default("0.00"),
    create_at: timestamp("create_at", { withTimezone: true }).defaultNow(),
    update_at: timestamp("update_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});
