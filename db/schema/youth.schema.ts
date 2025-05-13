import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { statusEnum } from "./enums.schema";
import { classes } from "./class.schema";
import { relations } from "drizzle-orm";
import { amphoes, provinces, tambons } from "./location.schema";

export const youths = pgTable("youths", {
  id: serial("id").primaryKey(),
  citizen_id: varchar("citizen_id", { length: 20 }).default("-"),
  email: varchar("email", { length: 255 }),
  p_name: varchar("p_name", { length: 100 }),
  f_name: varchar("f_name", { length: 100 }),
  l_name: varchar("l_name", { length: 100 }),
  full_name: varchar("full_name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  tambon: integer("tambon").default(0).references(() => tambons.id),
  amphoe: integer("amphoe").default(0).references(() => amphoes.id),
  province: integer("province").default(0).references(() => provinces.id),
  zip_code: varchar("zip_code", { length: 5 }),
  full_address: text("full_address"),
  year_start: varchar("year_start", { length: 10 }),
  class_id: integer("class_id").default(0).references(() => classes.id),
  remark: text("remark"),
  status: statusEnum("status").default("active").notNull(),
  create_at: timestamp("create_at", { withTimezone: true }).defaultNow(),
  update_at: timestamp("update_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});

export const youthsRelations = relations(youths, ({ one }) => ({
  class: one(classes, { fields: [youths.class_id], references: [classes.id] }),
}));