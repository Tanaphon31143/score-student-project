"use client";

import { Button } from "@heroui/react";
import { Icon } from "./icons";

/** สลับธีมสว่าง/มืด — ใส่ class "dark" ที่ <html> และจำค่าไว้ใน localStorage */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const dark = !root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    root.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  return (
    <Button
      isIconOnly
      size="sm"
      variant="ghost"
      aria-label="สลับธีมสว่าง/มืด"
      onPress={toggle}
      className="rounded-full text-ink!"
    >
      {/* ไอคอนสลับด้วย CSS จึงไม่เกิด hydration mismatch */}
      <span className="flex dark:hidden">
        <Icon name="moon" className="size-4" />
      </span>
      <span className="hidden dark:flex">
        <Icon name="sun" className="size-4" />
      </span>
    </Button>
  );
}
