import { pgEnum } from "drizzle-orm/pg-core";

export const actionEnum = pgEnum('action_enum', [
    'create',
    'update',
    'delete'
]);

// user role
export const roleEnum = pgEnum('role_enum', [
    'user',
    'admin',
    'manager'
]);

// status record
export const statusEnum = pgEnum('status_enum', [
    'active',
    'inactive',
    'delete'
]);

// fund type
export const fundTypeEnum = pgEnum('fundType_enum', [
    'กองทุนถาวร',
    'กองทุนรายปี',
    'กองทุนบรมราชาภิเษก',
    'สมทบทุนทั่วไป',
    'กิจกรรม',
])

// class level
export const classLevelEnum = pgEnum("classLevel_enum", [
    "ปฐมวัย",
    "ประถมศึกษา",
    "มัธยมศึกษา",
    "อาชีวศึกษา",
    "อุดมศึกษา",
    "สามเณร",
    "เด็กก่อนวัยเรียน",
    "วิชาชีพระยะสั้น",
    "การศึกษานอกระบบ",
]);
