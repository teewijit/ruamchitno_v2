import {
    User, 
    UserCog, 
    Briefcase, 
    CheckCircle, 
    PauseCircle, 
    Trash2
} from "lucide-react"

export const labels = [
    {
        value: "c_username",
        label: "Username",
    },
    {
        value: "c_email",
        label: "Email",
    },
    {
        value: "c_fullname",
        label: "ชื่อ-นามสกุล",
    },
    {
        value: "c_role",
        label: "ระดับ",
    },
    {
        value: "e_status",
        label: "สถานะ",
    },
]

export const statuses = [
    {
        value: "active",
        label: "ปกติ",
        icon: CheckCircle,
    },
    {
        value: "inactive",
        label: "ปิดการใช้",
        icon: PauseCircle,
    },
    {
        value: "delete",
        label: "ยกเลิก",
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