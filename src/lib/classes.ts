import type { RowDataPacket } from "mysql2";
import { pool } from "./db";

export type ClassRow = { id: string; name: string; subject: string; section: string | null; studentCount: number };
export type ClassStudent = { id: string; name: string; email: string; image: string | null };

export async function countClasses(teacherId: string): Promise<number> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM `classroom` WHERE teacherId = ?", [teacherId]);
  return Number(rows[0].n);
}

export async function listClassesForTeacher(teacherId: string): Promise<ClassRow[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.id, c.name, c.subject, c.section, COUNT(e.studentId) AS studentCount
     FROM \`classroom\` c LEFT JOIN \`enrollment\` e ON e.classId = c.id
     WHERE c.teacherId = ? GROUP BY c.id, c.name, c.subject, c.section, c.createdAt
     ORDER BY c.createdAt DESC`,
    [teacherId],
  );
  return rows.map((r) => ({ ...(r as ClassRow), studentCount: Number(r.studentCount) }));
}

/** ดึงห้องเฉพาะของครูคนนี้ — ห้องของครูคนอื่นจะได้ null */
export async function getClassForTeacher(classId: string, teacherId: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, subject, section FROM `classroom` WHERE id = ? AND teacherId = ?",
    [classId, teacherId],
  );
  return (rows[0] as Omit<ClassRow, "studentCount"> | undefined) ?? null;
}

export async function listClassStudents(classId: string): Promise<ClassStudent[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, u.image FROM \`enrollment\` e
     JOIN \`user\` u ON u.id = e.studentId WHERE e.classId = ? ORDER BY u.name`,
    [classId],
  );
  return rows as ClassStudent[];
}

export async function listStudentsNotInClass(classId: string): Promise<ClassStudent[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, u.image FROM \`user\` u
     WHERE u.role = 'student'
       AND NOT EXISTS (SELECT 1 FROM \`enrollment\` e WHERE e.classId = ? AND e.studentId = u.id)
     ORDER BY u.name`,
    [classId],
  );
  return rows as ClassStudent[];
}

export type StudentClass = { id: string; name: string; subject: string; section: string | null; teacherName: string };

export async function listClassesForStudent(studentId: string): Promise<StudentClass[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.id, c.name, c.subject, c.section, t.name AS teacherName
     FROM \`enrollment\` e JOIN \`classroom\` c ON c.id = e.classId JOIN \`user\` t ON t.id = c.teacherId
     WHERE e.studentId = ? ORDER BY c.name`,
    [studentId],
  );
  return rows as StudentClass[];
}
