import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { classes } from '@/db/schema/class.schema';

export const insertClassSchema = createInsertSchema(classes, {
    name: z.string()
        .min(1, "กรุณากรอกชื่อผู้ใช้")
        .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร"),
    short_name: z.string()
        .min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร")
        .max(255, "รหัสผ่านต้องไม่เกิน 255 ตัวอักษร"),
});

export const selectClassSchema = createSelectSchema(classes);
export const updateClassSchema = insertClassSchema;
export type SelectClassSchemaType = z.infer<typeof insertClassSchema>;
export type InsertClassSchemaType = z.infer<typeof insertClassSchema>;
export type UpdateClassSchemaType = z.infer<typeof updateClassSchema>;