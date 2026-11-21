"use client";

import { useActionState, useEffect, useState } from "react";
import { Alert, Button, Input, Label, Spinner, TextField } from "@heroui/react";
import { Icon } from "../../_components/icons";
import { createClass, type CreateClassState } from "./actions";

export function CreateClassForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<CreateClassState, FormData>(createClass, null);

  // ข้อความสำเร็จหายเองใน 4 วินาที (ไม่ค้างเมื่อกลับมาหน้านี้อีก)
  const [dismissed, setDismissed] = useState<typeof state>(null);
  useEffect(() => {
    if (!state?.ok) return;
    const t = setTimeout(() => setDismissed(state), 4000);
    return () => clearTimeout(t);
  }, [state]);

  if (!open) {
    return (
      <Button onPress={() => setOpen(true)} className="bg-ink! text-paper!">
        <Icon name="plus" className="size-4" /> สร้างห้องเรียน
      </Button>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-medium">สร้างห้องเรียน</p>
        <Button size="sm" variant="ghost" onPress={() => setOpen(false)}>
          ปิด
        </Button>
      </div>

      {state && state !== dismissed && (
        <Alert status={state.ok ? "success" : "danger"} className="mb-4">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{state.message}</Alert.Title>
          </Alert.Content>
        </Alert>
      )}

      {/* key เปลี่ยนทุกครั้งที่ส่ง: สำเร็จ = ฟอร์มว่าง, ผิดพลาด = เติมค่าเดิมกลับ */}
      <form key={JSON.stringify(state)} action={action} className="grid gap-4 sm:grid-cols-3">
        <TextField isRequired name="name" defaultValue={state?.values?.name}>
          <Label>ชื่อห้องเรียน</Label>
          <Input placeholder="เช่น ฟิสิกส์ ม.4/2" />
        </TextField>
        <TextField isRequired name="subject" defaultValue={state?.values?.subject}>
          <Label>วิชา</Label>
          <Input placeholder="เช่น ฟิสิกส์พื้นฐาน" />
        </TextField>
        <TextField name="section" defaultValue={state?.values?.section}>
          <Label>ชั้น/ห้อง (ไม่บังคับ)</Label>
          <Input placeholder="เช่น ม.4/2" />
        </TextField>
        <div className="sm:col-span-3 sm:flex sm:justify-end">
          <Button type="submit" isDisabled={pending} className="bg-ink! text-paper!">
            {pending && <Spinner size="sm" color="current" />}
            สร้าง
          </Button>
        </div>
      </form>
    </div>
  );
}
