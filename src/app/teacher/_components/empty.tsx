import { EmptyState } from "@heroui/react";
import { Icon, type IconName } from "../../_components/icons";

/** กล่องว่างสำหรับส่วนที่ยังไม่มีข้อมูล */
export function Empty({ icon, title, desc }: { icon: IconName; title: string; desc: string }) {
  return (
    <EmptyState className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-20 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-ink/[0.05] text-muted">
        <Icon name={icon} className="size-5" strokeWidth={1.75} />
      </span>
      <p className="mt-4 font-medium">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted">{desc}</p>
    </EmptyState>
  );
}
