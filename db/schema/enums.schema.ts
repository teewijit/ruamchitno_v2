import { pgEnum } from "drizzle-orm/pg-core";

// user role
export const roleEnum = pgEnum('role', [
    'user',
    'admin',
    'manager'
]);

// status record
export const statusEnum = pgEnum('status', [
    'active',
    'inactive',
    'delete'
]);

// fund type
export const fundTypeEnum = pgEnum('fundType', [
    'กองทุนถาวร',
    'กองทุนรายปี',
    'กองทุนบรมราชาภิเษก',
    'สมทบทุนทั่วไป',
    'กิจกรรม',
])

// class level
export const classLevelEnum = pgEnum('classLevel', [
    'ปฐมวัย',
    'ประถมศึกษา',
    'มัธยมศึกษา',
    'อาชีวศึกษา',
    'อุดมศึกษา',
    'สามเณร',
    'เด็กก่อนวัยเรียน',
    'วิชาชีพระยะสั้น',
    'การศึกษานอกระบบ',
]);