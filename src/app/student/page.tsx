import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listClassesForStudent } from "@/lib/classes";
import { getCurrentUser } from "@/lib/session";
import { Icon } from "../_components/icons";
import { ThemeToggle } from "../_components/theme-toggle";
import { SignOutButton } from "../teacher/_components/sign-out-button";

async function StudentHome() {
  const user = await getCurrentUser();
  if (user.role === "teacher") redirect("/teacher");
  const classes = await listClassesForStudent(user.id);
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">สวัสดี, {user.name}</h1>
      <p className="mt-1 text-sm text-muted">ห้องเรียนที่คุณอยู่</p>

      {classes.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line px-5 py-16 text-center text-sm text-muted">
          ยังไม่มีห้องเรียน เมื่อคุณครูเพิ่มคุณเข้าห้อง ห้องเรียนจะแสดงที่นี่
        </p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {classes.map((c) => (
            <div key={c.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-ink/[0.05] text-muted">
                  <Icon name="book" className="size-4" strokeWidth={1.75} />
                </span>
                {c.section && <span className="text-xs text-muted">{c.section}</span>}
              </div>
              <p className="mt-5 font-medium">{c.name}</p>
              <p className="text-sm text-muted">{c.subject}</p>
              <p className="mt-6 border-t border-line pt-4 text-xs text-muted">ครู {c.teacherName}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function StudentPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between border-b border-line px-6 py-3">
        <Link href="/student" className="text-sm font-semibold tracking-tight">
          ScoreHub
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Suspense fallback={<div className="h-8 w-56 animate-pulse rounded-lg bg-line" />}>
          <StudentHome />
        </Suspense>
      </main>
    </div>
  );
}
