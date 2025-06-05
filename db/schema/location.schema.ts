import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const provinces = pgTable("provinces", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const provincesRelations = relations(provinces, ({ many }) => ({
  amphoes: many(amphoes),
}));

export const amphoes = pgTable("amphoes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  province_id: integer("province_id").notNull().references(() => provinces.id),
});

export const amphoesRelations = relations(amphoes, ({ one, many }) => ({
  province: one(provinces, {
    fields: [amphoes.province_id],
    references: [provinces.id],
  }),
  tambons: many(tambons),
}));

export const tambons = pgTable("tambons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  amphoe_id: integer("amphoe_id").notNull().references(() => amphoes.id),
});

export const tambonsRelations = relations(tambons, ({ one }) => ({
  amphoe: one(amphoes, {
    fields: [tambons.amphoe_id],
    references: [amphoes.id],
  }),
}));
