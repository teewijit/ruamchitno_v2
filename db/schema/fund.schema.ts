import { numeric, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { fundTypeEnum, statusEnum } from "./enums.schema";
import { relations } from "drizzle-orm";
import { fundYearlyAmounts } from "./fund-yearly-amounts.schema";

export const funds = pgTable("funds", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    fund_type: fundTypeEnum("fund_type").notNull(),
    phone: varchar("phone", { length: 20 }),
    fex: varchar("fex", { length: 20 }),
    email: varchar("email", { length: 255 }),
    address: text("address"),
    tambon: varchar("tambon", { length: 255 }),
    amphoe: varchar("amphoe", { length: 255 }),
    province: varchar("province", { length: 255 }),

    // ข้อมูลทางการเงิน
    initial_amount: numeric("initial_amount", { precision: 15, scale: 2 }).default("0.00"), // เงินตั้งต้นก่อนระบบ
    donated_amount: numeric("donated_amount", { precision: 15, scale: 2 }).default("0.00"), // บริจาคสะสม
    used_amount: numeric("used_amount", { precision: 15, scale: 2 }).default("0.00"), // ใช้ไป
    remaining_amount: numeric("remaining_amount", { precision: 15, scale: 2 }).default("0.00"), // คงเหลือ

    remark: text("remark"),
    status: statusEnum("status").default("active").notNull(),
    first_donate_year: varchar("first_donate_year", { length: 10 }),
    last_donate_year: varchar("last_donate_year", { length: 10 }),
    create_at: timestamp("create_at", { withTimezone: true }).defaultNow(),
    update_at: timestamp("update_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
})

export const fundRelations = relations(funds, ({ many }) => ({
    yearlyAmounts: many(fundYearlyAmounts),
}));