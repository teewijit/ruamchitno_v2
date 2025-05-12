import {
    CheckCircle,
    PauseCircle,
    Trash2
} from "lucide-react"

export const labels = [
    {
        value: "fullname",
        label: "ชื่อ-นามสกุล",
    },
    {
        value: "full_address",
        label: "ที่อยู่",
    },
    {
        value: "remark",
        label: "รายละเอียด",
    },
    {
        value: "status",
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
        label: "ปิดการใช้งาน",
        icon: PauseCircle,
    },
    {
        value: "delete",
        label: "ลบ",
        icon: Trash2,
    },
];