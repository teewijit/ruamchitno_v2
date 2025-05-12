import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { statusEnum } from "./enums.schema";
import { classes } from "./class.schema";
import { relations } from "drizzle-orm";

export const youths = pgTable("youths", {
  id: serial("id").primaryKey(),
  citizen_id: varchar("citizen_id", { length: 20 }),
  email: varchar("email", { length: 255 }),
  p_name: varchar("p_name", { length: 100 }),
  f_name: varchar("f_name", { length: 100 }),
  l_name: varchar("l_name", { length: 100 }),
  full_name: varchar("full_name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  tambon: varchar("tambon", { length: 255 }),
  amphoe: varchar("amphoe", { length: 255 }),
  province: varchar("province", { length: 255 }),
  zip_code: varchar("zip_code", { length: 5 }),
  full_address: text("full_address"),
  year_start: varchar("year_start", { length: 10 }),
  class_id: integer("class_id").references(() => classes.id),
  remark: text("remark"),
  status: statusEnum("status").default("active").notNull(),
  create_at: timestamp("create_at", { withTimezone: true }).defaultNow(),
  update_at: timestamp("update_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const youthsRelations = relations(youths, ({ one }) => ({
  class: one(classes, { fields: [youths.class_id], references: [classes.id] }),
}));