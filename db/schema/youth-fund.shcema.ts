import { integer, numeric, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { youths } from "./youth.schema";
import { classes } from "./class.schema";
import { funds } from "./fund.schema";
import { statusEnum } from "./enums.schema";
import { relations } from "drizzle-orm";

export const youthFund = pgTable("youth_fund", {
  id: serial("id").primaryKey(),
  p_name: varchar("p_name", { length: 100 }),
  f_name: varchar("f_name", { length: 100 }),
  l_name: varchar("l_name", { length: 100 }),
  full_name: varchar("full_name", { length: 255 }),
  youth_id: integer("youth_id").references(() => youths.id),
  fund_id: integer("fund_id").references(() => funds.id),
  class_id: integer("class_id").references(() => classes.id),
  academic_year: varchar("academic_year", { length: 10 }),
  note: text("note"),
  remark: text("remark"),
  status: statusEnum("status").default("active").notNull(),
  gpa: numeric("gpa", { precision: 3, scale: 2 }).default("0.00"),
  create_at: timestamp("create_at", { withTimezone: true }).defaultNow(),
  update_at: timestamp("update_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const youthFundRelations = relations(youthFund, ({ one }) => ({
  youth: one(youths, { fields: [youthFund.youth_id], references: [youths.id] }),
  fund: one(funds, { fields: [youthFund.fund_id], references: [funds.id] }),
  class: one(classes, { fields: [youthFund.class_id], references: [classes.id] }),
}));