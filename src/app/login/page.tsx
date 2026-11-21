import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "../_components/icons";
import { ThemeToggle } from "../_components/theme-toggle";
import { LoginCard } from "./login-card";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ — ScoreHub",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="group flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
          <Icon name="arrowLeft" className="size-4 transition-transform group-hover:-translate-x-0.5" />
          หน้าแรก
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-24">
        <div className="w-full max-w-sm">
          <p className="text-sm font-semibold tracking-tight">ScoreHub</p>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">เข้าสู่ระบบ</h1>
          <p className="mt-2 text-muted">ใช้อีเมลที่คุณครูเพิ่มไว้ในห้องเรียน</p>

          <div className="mt-8">
            <Suspense>
              <LoginCard />
            </Suspense>
          </div>

          <p className="mt-8 border-t border-line pt-6 text-sm leading-relaxed text-muted">
            ระบบนี้ไม่มีการสมัครสมาชิก คุณครูจะเพิ่มนักเรียนเข้าห้องเรียนด้วยอีเมล
            ถ้ายังเข้าไม่ได้ ให้แจ้งคุณครูประจำวิชา
          </p>
        </div>
      </main>
    </div>
  );
}
