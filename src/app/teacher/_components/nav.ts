import type { IconName } from "../../_components/icons";

export const teacherNav: { href: string; label: string; icon: IconName }[] = [
  { href: "/teacher", label: "ภาพรวม", icon: "home" },
  { href: "/teacher/classes", label: "ห้องเรียน", icon: "book" },
  { href: "/teacher/assignments", label: "งานที่มอบหมาย", icon: "clipboard" },
  { href: "/teacher/grading", label: "ตรวจงาน", icon: "check" },
  { href: "/teacher/students", label: "นักเรียน", icon: "users" },
];
