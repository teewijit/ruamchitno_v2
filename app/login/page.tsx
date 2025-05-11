import { Metadata } from "next";
import { LoginForm } from "./(form)/login.form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  description: "ระบบหลังบ้านสำหรับผู้ดูแลมูลนิธิร่วมจิตต์น้อมเกล้าฯ",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin/user");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}
