import {
    User, 
    UserCog, 
    Briefcase, 
    CheckCircle, 
    PauseCircle, 
    Trash2
} from "lucide-react"

export const labels = [
    //users
    {
        value: "username",
        label: "Username",
    },
    {
        value: "email",
        label: "Email",
    },
    {
        value: "full_name",
        label: "ชื่อ-นามสกุล",
    },
    {
        value: "role",
        label: "ระดับ",
    },
    {
        value: "status",
        label: "สถานะ",
    },

    //youths
    {
        value: "full_name",
        label: "ชื่อ-นามสกุล",
    },
    {
        value: "full_address",
        label: "ที่อยู่",
    },
    {
        value: "year_start",
        label: "ปีที่เริ่ม",
    },
    {
        value: "short_name",
        label: "ชั้นที่เริ่ม",
    },
    {
        value: "remark",
        label: "รายละเอียด",
    },
]

export const statuses = [
    {
        value: "active",
        label: "ออนไลน์",
        icon: CheckCircle,
    },
    {
        value: "inactive",
        label: "ออฟไลน์",
        icon: PauseCircle,
    },
    {
        value: "delete",
        label: "ปิดการใช้งาน",
        icon: Trash2,
    },
];

export const roles = [
    {
        value: "user",
        label: "User",
        icon: User,
    },
    {
        value: "admin",
        label: "Admin",
        icon: UserCog,
    },
    {
        value: "manager",
        label: "Manager",
        icon: Briefcase,
    },
];