import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export type Role = "teacher" | "student";
export type CurrentUser = { id: string; name: string; email: string; image: string | null; role: Role };

/** อ่านผู้ใช้ปัจจุบัน — ไม่ได้ล็อคอินจะถูกส่งไปหน้า /login (ต้องเรียกภายใน <Suspense>) */
export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const u = session.user;
  return { id: u.id, name: u.name, email: u.email, image: u.image ?? null, role: (u.role as Role) ?? "student" };
}

/** ใช้ในหน้าของครู — นักเรียนจะถูกส่งกลับไปหน้าของตัวเอง */
export async function requireTeacher(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (user.role !== "teacher") redirect("/student");
  return user;
}

export const homeFor = (role: Role) => (role === "teacher" ? "/teacher" : "/student");
