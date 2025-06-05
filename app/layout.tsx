import * as React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "@/components/ui/sonner";
import { Chakra_Petch } from "next/font/google";
import NextAuthProvider from "@/components/providers/next-auth-provider";
import { getServerSession } from "next-auth";

const chakraPetch = Chakra_Petch({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-chakra-petch",
});

export const metadata: Metadata = {
  title: {
    template: '%s | มูลนิธิร่วมจิตต์น้อมเกล้าฯ',
    default: 'มูลนิธิร่วมจิตต์น้อมเกล้าฯ',
  },
  description: "ระบบหลังบ้าน",
  applicationName: 'Ruamchitnormklao Fundation',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={chakraPetch.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NuqsAdapter>
            <NextAuthProvider session={session}>
              {children}
            </NextAuthProvider>
            <Toaster richColors={true} />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
