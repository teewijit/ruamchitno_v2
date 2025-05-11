import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const affiliations = pgTable("affiliations", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    short_name: varchar("short_name", { length: 100 }).notNull(),
});
