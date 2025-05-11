import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-300 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4 drop-shadow-sm">
        ยินดีต้อนรับสู่ระบบของเรา
      </h1>
      <p className="text-lg md:text-xl text-purple-700 mb-8 max-w-xl">
      มูลนิธิร่วมจิตต์น้อมเกล้าฯ เพื่อเยาวชน
      </p>
      <Link
        href="/login"
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
      >
        เข้าใช้งานระบบ
      </Link>
    </div>
  );
}
