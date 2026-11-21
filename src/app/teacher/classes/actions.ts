"use server";

import { randomUUID } from "node:crypto";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { getClassForTeacher } from "@/lib/classes";
import { requireTeacher } from "@/lib/session";

export type CreateClassState = {
  ok: boolean;
  message: string;
  values?: { name: string; subject: string; section: string };
} | null;

/** สร้างห้องเรียนใหม่ของครูที่ล็อคอินอยู่ */
export async function createClass(_prev: CreateClassState, formData: FormData): Promise<CreateClassState> {
  const teacher = await requireTeacher();
  const name = String(formData.get("name") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const section = String(formData.get("section") ?? "").trim();
  const values = { name, subject, section };

  if (!name) return { ok: false, message: "กรุณาใส่ชื่อห้องเรียน", values };
  if (!subject) return { ok: false, message: "กรุณาใส่ชื่อวิชา", values };
  if (name.length > 255 || subject.length > 255 || section.length > 100) {
    return { ok: false, message: "ข้อความยาวเกินไป", values };
  }

  await pool.execute(
    "INSERT INTO `classroom` (id, name, subject, section, teacherId, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
    [randomUUID(), name, subject, section || null, teacher.id, new Date()],
  );
  refresh();
  return { ok: true, message: `สร้างห้อง ${name} แล้ว` };
}

/** ตรวจว่าห้องนี้เป็นของครูที่ล็อคอินอยู่ */
async function ownClassOrThrow(classId: string) {
  const teacher = await requireTeacher();
  const cls = await getClassForTeacher(classId, teacher.id);
  if (!cls) throw new Error("ไม่พบห้องเรียนนี้");
  return cls;
}

export async function enrollStudent(classId: string, studentId: string) {
  await ownClassOrThrow(classId);
  const [rows] = await pool.query<RowDataPacket[]>("SELECT role FROM `user` WHERE id = ?", [studentId]);
  if (rows[0]?.role !== "student") throw new Error("ไม่พบนักเรียนคนนี้");
  await pool.execute(
    "INSERT IGNORE INTO `enrollment` (classId, studentId, createdAt) VALUES (?, ?, ?)",
    [classId, studentId, new Date()],
  );
  refresh();
}

export async function unenrollStudent(classId: string, studentId: string) {
  await ownClassOrThrow(classId);
  await pool.execute("DELETE FROM `enrollment` WHERE classId = ? AND studentId = ?", [classId, studentId]);
  refresh();
}

export async function deleteClass(classId: string) {
  await ownClassOrThrow(classId);
  await pool.execute("DELETE FROM `classroom` WHERE id = ?", [classId]);
  redirect("/teacher/classes");
}
