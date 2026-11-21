"use client";

import { useTransition } from "react";
import { Button, Spinner } from "@heroui/react";
import { Icon } from "../../../_components/icons";
import { deleteClass, enrollStudent, unenrollStudent } from "../actions";

export function EnrollButton({ classId, studentId }: { classId: string; studentId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button size="sm" variant="tertiary" isDisabled={pending} onPress={() => start(() => enrollStudent(classId, studentId))}>
      {pending ? <Spinner size="sm" /> : <Icon name="plus" className="size-3.5" />}
      เพิ่มเข้าห้อง
    </Button>
  );
}

export function RemoveButton({ classId, studentId, name }: { classId: string; studentId: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="sm"
      variant="ghost"
      isDisabled={pending}
      className="text-muted"
      onPress={() => {
        if (confirm(`นำ ${name} ออกจากห้องนี้?`)) start(() => unenrollStudent(classId, studentId));
      }}
    >
      {pending ? <Spinner size="sm" /> : "นำออก"}
    </Button>
  );
}

export function DeleteClassButton({ classId, name }: { classId: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="sm"
      variant="danger-soft"
      isDisabled={pending}
      onPress={() => {
        if (confirm(`ลบห้อง ${name}? นักเรียนจะถูกนำออกจากห้องนี้ทั้งหมด (บัญชีนักเรียนยังอยู่)`)) {
          start(() => deleteClass(classId));
        }
      }}
    >
      {pending && <Spinner size="sm" color="current" />}
      ลบห้องเรียน
    </Button>
  );
}
