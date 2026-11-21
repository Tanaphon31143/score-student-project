"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../../_components/icons";
import { teacherNav } from "./nav";

type Orientation = "vertical" | "horizontal";

/** รายการเมนู — activeHref = หน้าที่ไฮไลต์ (null = ไม่ไฮไลต์ ใช้ตอนกำลังโหลด) */
export function SidebarNavLinks({ orientation = "vertical", activeHref = null }: { orientation?: Orientation; activeHref?: string | null }) {
  return (
    <nav className={orientation === "vertical" ? "flex flex-col gap-0.5" : "flex gap-1 overflow-x-auto"}>
      {teacherNav.map((item) => {
        const active = item.href === activeHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              active ? "bg-ink/[0.06] font-medium text-ink" : "text-muted hover:bg-ink/[0.04] hover:text-ink"
            }`}
          >
            <Icon name={item.icon} className="size-4" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** เมนูที่ไฮไลต์หน้าที่เปิดอยู่ (ต้องอยู่ใน <Suspense> เพราะอ่าน URL) */
export function SidebarNav({ orientation = "vertical" }: { orientation?: Orientation }) {
  const pathname = usePathname();
  const activeHref =
    teacherNav.find((i) => (i.href === "/teacher" ? pathname === i.href : pathname.startsWith(i.href)))?.href ?? null;
  return <SidebarNavLinks orientation={orientation} activeHref={activeHref} />;
}
