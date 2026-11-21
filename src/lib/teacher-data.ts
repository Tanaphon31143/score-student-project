import type { RowDataPacket } from "mysql2";
import { pool } from "./db";

export type StudentRow = { id: string; name: string; email: string; image: string | null; createdAt: Date; hasPassword: boolean };

export async function countStudents(): Promise<number> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM `user` WHERE role = 'student'");
  return Number(rows[0].n);
}

export async function listStudents(): Promise<StudentRow[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, u.image, u.createdAt,
            EXISTS (SELECT 1 FROM \`account\` a WHERE a.userId = u.id AND a.providerId = 'credential') AS hasPassword
     FROM \`user\` u WHERE u.role = 'student' ORDER BY u.name`,
  );
  return rows.map((r) => ({ ...(r as StudentRow), hasPassword: Boolean(r.hasPassword) }));
}
