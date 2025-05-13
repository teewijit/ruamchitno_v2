import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { youths } from '@/db/schema/youth.schema';

export const insertYouthSchema = createInsertSchema(youths, {
    f_name: z.string()
        .min(1, "กรุณากรอกชื่อผู้ใช้")
        .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร"),
    l_name: z.string()
        .min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร")
        .max(255, "รหัสผ่านต้องไม่เกิน 255 ตัวอักษร"),
});

export const updateYouthSchema = createInsertSchema(youths)
    .partial()
    .required({ id: true })


export const selectYouthSchema = createSelectSchema(youths);
export type SelectYouthSchemaType = z.infer<typeof insertYouthSchema>;
export type InsertYouthSchemaType = z.infer<typeof insertYouthSchema>;
export type UpdateYouthSchemaType = z.infer<typeof updateYouthSchema>;