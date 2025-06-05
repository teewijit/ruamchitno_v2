import { Metadata } from "next";
import UserFormLoginPage from "./(form)/user-login-form";

export const metadata: Metadata = {
    title: {
        template: 'เข้าสู่ระบบ | มูลนิธิร่วมจิตต์น้อมเกล้าฯ',
        default: 'มูลนิธิร่วมจิตต์น้อมเกล้าฯ',
    },
};

export default function LoginPage() {

    return (
        <div className="flex items-center justify-center min-h-screen">
            <UserFormLoginPage></UserFormLoginPage>
        </div>
    )
}
