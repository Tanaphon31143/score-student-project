import { Suspense } from "react";
import { Avatar, Chip } from "@heroui/react";
import { listStudents } from "@/lib/teacher-data";
import { requireTeacher } from "@/lib/session";
import { Empty } from "../_components/empty";
import { PageHeader } from "../_components/page-header";
import { AddStudentForm } from "./add-student-form";

const dateFmt = new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" });

async function StudentList() {
  await requireTeacher();
  const students = await listStudents();

  if (students.length === 0) {
    return <Empty icon="users" title="ยังไม่มีนักเรียน" desc="กด เพิ่มนักเรียน เพื่อใส่อีเมลนักเรียนเข้าระบบ" />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-line px-5 py-3 text-xs text-muted sm:grid-cols-[1fr_140px_120px]">
        <span>นักเรียน ({students.length})</span>
        <span className="hidden sm:block">เข้าสู่ระบบด้วย</span>
        <span className="text-right">เพิ่มเมื่อ</span>
      </div>
      <ul className="divide-y divide-line">
        {students.map((s) => (
          <li key={s.id} className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 sm:grid-cols-[1fr_140px_120px]">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar size="sm">
                {s.image && <Avatar.Image src={s.image} alt={s.name} referrerPolicy="no-referrer" />}
                <Avatar.Fallback className="text-xs">{s.name.slice(0, 2)}</Avatar.Fallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.name}</p>
                <p className="truncate text-xs text-muted">{s.email}</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <Chip size="sm" variant="soft">{s.hasPassword ? "รหัสผ่าน / Google" : "Google"}</Chip>
            </div>
            <span className="text-right text-xs text-muted tabular-nums">{dateFmt.format(s.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StudentsPage() {
  return (
    <>
      <PageHeader title="นักเรียน" desc="นักเรียนที่เข้าสู่ระบบได้ ครูเป็นคนเพิ่มเท่านั้น" />
      <div className="mb-6">
        <AddStudentForm />
      </div>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-line" />}>
        <StudentList />
      </Suspense>
    </>
  );
}
