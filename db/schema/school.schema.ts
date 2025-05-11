import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { statusEnum } from "./enums.schema";
import { affiliations } from "./affiliation.schema";
import { relations } from "drizzle-orm";

export const schools = pgTable("schools", {
    id: serial("id").primaryKey(),
    aff_id: integer("aff_id").references(() => affiliations.id).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    fex: varchar("fex", { length: 20 }),
    email: varchar("email", { length: 255 }),
    address: text("address"),
    tambon: varchar("tambon", { length: 255 }),
    amphoe: varchar("amphoe", { length: 255 }),
    province: varchar("province", { length: 255 }),
    remark: text("remark"),
    status: statusEnum("status").default("active").notNull(),
    create_at: timestamp("create_at", { withTimezone: true }).defaultNow(),
    update_at: timestamp("update_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
})

export const schoolRelations = relations(schools, ({ one }) => ({
    affiliation: one(affiliations, { fields: [schools.aff_id], references: [affiliations.id] }),
}));
