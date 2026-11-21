"use client";

import { useActionState, useEffect, useState } from "react";
import { Alert, Button, Input, Label, Spinner, TextField } from "@heroui/react";
import { Icon } from "../../_components/icons";
import { addStudent, type AddStudentState } from "./actions";

export function AddStudentForm() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<AddStudentState, FormData>(addStudent, null);

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
        <Icon name="plus" className="size-4" /> เพิ่มนักเรียน
      </Button>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-medium">เพิ่มนักเรียน</p>
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
          <Label>ชื่อ-นามสกุล</Label>
          <Input placeholder="เช่น ปณิตา ใจดี" />
        </TextField>
        <TextField isRequired name="email" type="email" defaultValue={state?.values?.email}>
          <Label>อีเมล</Label>
          <Input placeholder="name@gmail.com" />
        </TextField>
        <TextField name="password" type="password">
          <Label>รหัสผ่าน (ไม่บังคับ)</Label>
          <Input placeholder="อย่างน้อย 8 ตัว" autoComplete="new-password" />
        </TextField>
        <p className="text-xs text-muted sm:col-span-2 sm:self-center">
          ไม่ใส่รหัสผ่าน = นักเรียนเข้าสู่ระบบด้วย Google บัญชีที่อีเมลตรงกันได้อย่างเดียว
        </p>
        <Button type="submit" isDisabled={pending} className="bg-ink! text-paper!">
          {pending && <Spinner size="sm" color="current" />}
          บันทึก
        </Button>
      </form>
    </div>
  );
}
