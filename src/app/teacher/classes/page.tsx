import Link from "next/link";
import { Suspense } from "react";
import { listClassesForTeacher } from "@/lib/classes";
import { requireTeacher } from "@/lib/session";
import { Icon } from "../../_components/icons";
import { Empty } from "../_components/empty";
import { PageHeader } from "../_components/page-header";
import { CreateClassForm } from "./create-class-form";

async function ClassGrid() {
  const teacher = await requireTeacher();
  const classes = await listClassesForTeacher(teacher.id);

  if (classes.length === 0) {
    return <Empty icon="book" title="ยังไม่มีห้องเรียน" desc="กด สร้างห้องเรียน เพื่อเริ่มต้น แล้วเพิ่มนักเรียนเข้าห้อง" />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {classes.map((c) => (
        <Link
          key={c.id}
          href={`/teacher/classes/${c.id}`}
          className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-ink/30"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-ink/[0.05] text-muted">
              <Icon name="book" className="size-4" strokeWidth={1.75} />
            </span>
            {c.section && <span className="text-xs text-muted">{c.section}</span>}
          </div>
          <p className="mt-5 font-medium">{c.name}</p>
          <p className="text-sm text-muted">{c.subject}</p>
          <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <Icon name="users" className="size-3.5" /> นักเรียน {c.studentCount} คน
            </span>
            <Icon name="arrowRight" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function ClassesPage() {
  return (
    <>
      <PageHeader title="ห้องเรียน" desc="ห้องเรียนทั้งหมดที่คุณสอน" />
      <div className="mb-6">
        <CreateClassForm />
      </div>
      <Suspense fallback={<div className="h-44 animate-pulse rounded-2xl bg-line" />}>
        <ClassGrid />
      </Suspense>
    </>
  );
}
