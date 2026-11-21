import Link from "next/link";
import { Suspense } from "react";
import { countClasses } from "@/lib/classes";
import { countStudents } from "@/lib/teacher-data";
import { requireTeacher } from "@/lib/session";
import { Icon } from "../_components/icons";

async function Greeting() {
  const user = await requireTeacher();
  return <h1 className="text-2xl font-semibold tracking-tight">สวัสดี, {user.name}</h1>;
}

async function Overview() {
  const teacher = await requireTeacher();
  const [students, classes] = await Promise.all([countStudents(), countClasses(teacher.id)]);

  const steps = [
    { done: classes > 0, title: "สร้างห้องเรียน", desc: "ตั้งชื่อวิชาและห้องที่สอน", href: "/teacher/classes" },
    { done: students > 0, title: "เพิ่มนักเรียน", desc: "ใส่อีเมลนักเรียนเข้าระบบ", href: "/teacher/students" },
    { done: false, title: "มอบหมายงานแรก", desc: "กำหนดรายละเอียดและวันส่ง", href: "/teacher/assignments" },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/teacher/students" className="group rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-ink/30">
          <p className="text-sm text-muted">นักเรียนทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{students}</p>
          <p className="mt-3 flex items-center gap-1 text-xs text-muted group-hover:text-ink">
            จัดการนักเรียน <Icon name="arrowRight" className="size-3" />
          </p>
        </Link>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm text-muted">งานรอตรวจ</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-muted">—</p>
          <p className="mt-3 text-xs text-muted">ยังไม่มีงานที่มอบหมาย</p>
        </div>
        <Link href="/teacher/classes" className="group rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-ink/30">
          <p className="text-sm text-muted">ห้องเรียน</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{classes}</p>
          <p className="mt-3 flex items-center gap-1 text-xs text-muted group-hover:text-ink">
            {classes > 0 ? "ดูห้องเรียน" : "สร้างห้องเรียนแรก"} <Icon name="arrowRight" className="size-3" />
          </p>
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="font-medium">เริ่มต้นใช้งาน</h2>
        <ol className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Link href={s.href} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink/[0.02]">
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full border text-xs ${
                    s.done ? "border-ink bg-ink text-paper" : "border-line text-muted"
                  }`}
                >
                  {s.done ? <Icon name="check" className="size-3.5" strokeWidth={2.5} /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${s.done ? "text-muted line-through" : ""}`}>{s.title}</p>
                  <p className="text-xs text-muted">{s.desc}</p>
                </div>
                <Icon name="arrowRight" className="size-4 text-muted" />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-line ${className}`} />;
}

export default function TeacherHome() {
  return (
    <>
      <div className="mb-10">
        <Suspense fallback={<Skeleton className="h-8 w-56" />}>
          <Greeting />
        </Suspense>
        <p className="mt-1 text-sm text-muted">ภาพรวมห้องเรียนของคุณ</p>
      </div>
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <Overview />
      </Suspense>
    </>
  );
}
