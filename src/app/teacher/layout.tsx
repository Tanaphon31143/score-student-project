import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeToggle } from "../_components/theme-toggle";
import { SidebarNav, SidebarNavLinks } from "./_components/sidebar-nav";
import { SidebarUser, SidebarUserSkeleton } from "./_components/sidebar-user";

export const metadata: Metadata = {
  title: "ครู — ScoreHub",
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper text-ink">
      {/* ===== เมนูด้านซ้าย (จอใหญ่) ===== */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line px-3 py-5 md:flex">
        <div className="flex items-center justify-between px-3">
          <Link href="/teacher" className="text-sm font-semibold tracking-tight">
            ScoreHub
          </Link>
          <ThemeToggle />
        </div>
        <p className="mt-8 px-3 text-xs font-medium text-muted">เมนู</p>
        <div className="mt-2">
          <Suspense fallback={<SidebarNavLinks />}>
            <SidebarNav />
          </Suspense>
        </div>
        <div className="mt-auto border-t border-line px-1 pt-4">
          <Suspense fallback={<SidebarUserSkeleton />}>
            <SidebarUser />
          </Suspense>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ===== แถบบน (มือถือ) ===== */}
        <header className="sticky top-0 z-10 border-b border-line bg-paper/90 px-4 pb-2 pt-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/teacher" className="text-sm font-semibold tracking-tight">
              ScoreHub
            </Link>
            <ThemeToggle />
          </div>
          <div className="mt-2">
            <Suspense fallback={<SidebarNavLinks orientation="horizontal" />}>
              <SidebarNav orientation="horizontal" />
            </Suspense>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 md:px-10">{children}</main>
      </div>
    </div>
  );
}
