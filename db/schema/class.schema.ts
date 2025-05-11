import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";
import { classLevelEnum } from "./enums.schema";
import { relations } from "drizzle-orm";
import { youthFund } from "./youth-fund.shcema";

export const classes = pgTable("classes", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    short_name: varchar("short_name", { length: 100 }).notNull(),
    class_level: classLevelEnum("class_level").notNull(),
});

export const classRelations = relations(classes, ({ many }) => ({
    youthFund: many(youthFund),
}));