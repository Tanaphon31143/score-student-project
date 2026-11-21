import { Avatar } from "@heroui/react";
import { requireTeacher } from "@/lib/session";
import { SignOutButton } from "./sign-out-button";

/** ผู้ใช้ที่มุมล่างของเมนู — ตรวจสิทธิ์ครูไปด้วย (ไม่ใช่ครูจะถูกส่งออก) */
export async function SidebarUser() {
  const user = await requireTeacher();
  return (
    <div className="flex items-center gap-2.5">
      <Avatar size="sm">
        {user.image && <Avatar.Image src={user.image} alt={user.name} referrerPolicy="no-referrer" />}
        <Avatar.Fallback className="text-xs">{user.name.slice(0, 2)}</Avatar.Fallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted">ครู</p>
      </div>
      <SignOutButton />
    </div>
  );
}

export function SidebarUserSkeleton() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="size-8 animate-pulse rounded-full bg-line" />
      <div className="h-3 flex-1 animate-pulse rounded bg-line" />
    </div>
  );
}
