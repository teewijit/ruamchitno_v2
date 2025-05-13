// schema.ts
import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from '@/db/schema/user.schema';

// Schema สำหรับการ insert - มี required fields ทั้งหมด
export const insertUserSchema = createInsertSchema(users, {
    username: z.string()
        .min(1, "กรุณากรอกชื่อผู้ใช้")
        .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร"),
    password: z.string()
        .min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร")
        .max(255, "รหัสผ่านต้องไม่เกิน 255 ตัวอักษร"),
    email: z.string().email(),
});

// Schema สำหรับการ update - ทำให้ fields ส่วนใหญ่เป็น optional
export const updateUserSchema = createInsertSchema(users)
    .partial() // ทำให้ทุก field เป็น optional
    .required({ id: true }) // ยกเว้น user_id ที่ต้องการระบุว่าจะ update record ไหน

export const loginUserSchema = createInsertSchema(users, {
    username: z.string()
        .min(1, "กรุณากรอกชื่อผู้ใช้")
        .max(255, "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร"),
    password: z.string()
        .min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร")
        .max(255, "รหัสผ่านต้องไม่เกิน 255 ตัวอักษร"),
});

export const passwordSchema = z.object({
    password: z.string().min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร"),
});

// สร้าง TypeScript types
export const selectUserSchema = createSelectSchema(users);
export type SelectUserSchemaType = z.infer<typeof insertUserSchema>;
export type InsertUserSchemaType = z.infer<typeof insertUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
export type LoginUserSchemaType = z.infer<typeof loginUserSchema>;
export type PasswordSchemaSchemaType = z.infer<typeof passwordSchema>;