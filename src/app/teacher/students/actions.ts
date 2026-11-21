"use server";

import { randomUUID } from "node:crypto";
import { refresh } from "next/cache";
import type { RowDataPacket } from "mysql2";
import { hashPassword } from "better-auth/crypto";
import { pool } from "@/lib/db";
import { requireTeacher } from "@/lib/session";

export type AddStudentState = { ok: boolean; message: string; values?: { name: string; email: string } } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** ครูเพิ่มนักเรียน: สร้างผู้ใช้ role=student (+ รหัสผ่านถ้าใส่มา) */
export async function addStudent(_prev: AddStudentState, formData: FormData): Promise<AddStudentState> {
  await requireTeacher();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // ส่งค่าที่กรอกกลับไป ให้ฟอร์มไม่หายเมื่อมีข้อผิดพลาด
  const fail = (message: string): AddStudentState => ({ ok: false, message, values: { name, email } });

  if (!name) return fail("กรุณาใส่ชื่อนักเรียน");
  if (!EMAIL_RE.test(email)) return fail("รูปแบบอีเมลไม่ถูกต้อง");
  if (password && password.length < 8) return fail("รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร");

  const [existing] = await pool.query<RowDataPacket[]>("SELECT role FROM `user` WHERE email = ?", [email]);
  if (existing.length) {
    return fail(existing[0].role === "teacher" ? "อีเมลนี้เป็นบัญชีของครู" : "มีนักเรียนที่ใช้อีเมลนี้อยู่แล้ว");
  }

  const id = randomUUID();
  const now = new Date();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      "INSERT INTO `user` (id, name, email, emailVerified, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'student', ?, ?)",
      [id, name, email, true, now, now],
    );
    if (password) {
      await conn.execute(
        "INSERT INTO `account` (id, accountId, providerId, userId, password, createdAt, updatedAt) VALUES (?, ?, 'credential', ?, ?, ?, ?)",
        [randomUUID(), id, id, await hashPassword(password), now, now],
      );
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }

  refresh();
  return {
    ok: true,
    message: `เพิ่ม ${name} แล้ว — ${password ? "เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน หรือ Google ได้" : "เข้าสู่ระบบด้วย Google ได้"}`,
  };
}
