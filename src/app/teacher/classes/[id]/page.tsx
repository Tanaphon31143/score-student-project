import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Avatar } from "@heroui/react";
import { getClassForTeacher, listClassStudents, listStudentsNotInClass, type ClassStudent } from "@/lib/classes";
import { requireTeacher } from "@/lib/session";
import { Icon } from "../../../_components/icons";
import { DeleteClassButton, EnrollButton, RemoveButton } from "./roster-buttons";

function StudentRow({ s, children }: { s: ClassStudent; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 px-5 py-3">
      <Avatar size="sm">
        {s.image && <Avatar.Image src={s.image} alt={s.name} referrerPolicy="no-referrer" />}
        <Avatar.Fallback className="text-xs">{s.name.slice(0, 2)}</Avatar.Fallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{s.name}</p>
        <p className="truncate text-xs text-muted">{s.email}</p>
      </div>
      {children}
    </li>
  );
}

async function ClassDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await requireTeacher();
  const cls = await getClassForTeacher(id, teacher.id);
  if (!cls) notFound();

  const [members, others] = await Promise.all([listClassStudents(id), listStudentsNotInClass(id)]);

  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {cls.subject}
            {cls.section ? ` · ${cls.section}` : ""}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{cls.name}</h1>
        </div>
        <DeleteClassButton classId={cls.id} name={cls.name} />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium">นักเรียนในห้อง ({members.length})</h2>
        {members.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-sm text-muted">
            ยังไม่มีนักเรียนในห้องนี้ เลือกจากรายชื่อด้านล่างได้เลย
          </p>
        ) : (
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {members.map((s) => (
              <StudentRow key={s.id} s={s}>
                <RemoveButton classId={cls.id} studentId={s.id} name={s.name} />
              </StudentRow>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium">เพิ่มนักเรียนเข้าห้อง</h2>
          <Link href="/teacher/students" className="text-xs text-muted hover:text-ink">
            นักเรียนยังไม่อยู่ในระบบ? เพิ่มที่หน้านักเรียน
          </Link>
        </div>
        {others.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-sm text-muted">
            นักเรียนทุกคนในระบบอยู่ในห้องนี้แล้ว
          </p>
        ) : (
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {others.map((s) => (
              <StudentRow key={s.id} s={s}>
                <EnrollButton classId={cls.id} studentId={s.id} />
              </StudentRow>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function ClassPage({ params }: PageProps<"/teacher/classes/[id]">) {
  return (
    <>
      <Link href="/teacher/classes" className="group mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <Icon name="arrowLeft" className="size-4 transition-transform group-hover:-translate-x-0.5" />
        ห้องเรียนทั้งหมด
      </Link>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-line" />}>
        <ClassDetail params={params} />
      </Suspense>
    </>
  );
}
