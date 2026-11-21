"use client";

import Link from "next/link";
import { Avatar, buttonVariants } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

const pillBtn = `${buttonVariants({ size: "sm" })} rounded-full bg-ink! px-4 text-paper! transition-opacity hover:opacity-85`;

/** ปุ่มบน navbar: ยังไม่เข้าสู่ระบบ = เข้าสู่ระบบ, เข้าแล้ว = รูป + ไปแดชบอร์ด */
export function UserMenu() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-8 w-24 animate-pulse rounded-full bg-line" />;
  }

  if (!session) {
    return (
      <Link href="/login" className={pillBtn}>
        เข้าสู่ระบบ
      </Link>
    );
  }

  const { name, image } = session.user;

  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        {image && <Avatar.Image src={image} alt={name} referrerPolicy="no-referrer" />}
        <Avatar.Fallback className="text-xs">{name.slice(0, 2)}</Avatar.Fallback>
      </Avatar>
      <Link href="/dashboard" className={pillBtn}>
        แดชบอร์ด
      </Link>
    </div>
  );
}
