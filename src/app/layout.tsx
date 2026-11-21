import type { Metadata } from "next";
import { Anuphan, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const anuphan = Anuphan({ variable: "--font-anuphan", subsets: ["thai", "latin"] });

export const metadata: Metadata = {
  title: "ScoreHub — ส่งงาน ตรวจงาน จบในที่เดียว",
  description: "แพลตฟอร์มส่งงานและตรวจงานออนไลน์สำหรับครูและนักเรียน",
};

// ใส่ธีมก่อนหน้าเว็บแสดงผล กันจอกะพริบ (ค่าที่บันทึกไว้ > ค่าของระบบ)
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${anuphan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
