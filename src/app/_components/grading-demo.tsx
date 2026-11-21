"use client";

import { useState } from "react";
import { Avatar, Button, Chip, ProgressBar, Tabs } from "@heroui/react";
import { Icon } from "./icons";

const students = [
  { name: "ปณิตา ใจดี", short: "ปณ", answer: "แรงโน้มถ่วงทำให้วัตถุตกลงสู่พื้นด้วยความเร่ง 9.8 m/s²" },
  { name: "ธนกร แสงทอง", short: "ธก", answer: "วัตถุตกเพราะโลกดึงดูด ยิ่งมวลมากยิ่งตกเร็ว" },
  { name: "กานต์ชนก มีสุข", short: "กช", answer: "ถ้าไม่มีแรงต้านอากาศ ทุกวัตถุตกด้วยความเร่งเท่ากัน" },
];

const feedbackBy = (s: number) =>
  s >= 9 ? "ยอดเยี่ยมมาก" : s >= 7 ? "ดีมาก ลองเพิ่มตัวอย่างนะ" : "ลองทบทวนอีกนิดนะ";

export function GradingDemo() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [graded, setGraded] = useState<Record<number, number>>({});

  const s = students[idx];
  const done = graded[idx] !== undefined;
  const gradedCount = Object.keys(graded).length;

  function save() {
    if (score === null) return;
    setGraded((g) => ({ ...g, [idx]: score }));
  }

  function next() {
    setIdx((i) => (i + 1) % students.length);
    setScore(null);
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-2 shadow-sm">
      <Tabs className="w-full">
        <Tabs.ListContainer className="mx-auto w-fit">
          <Tabs.List aria-label="มุมมอง">
            <Tabs.Tab id="teacher" className="gap-2 whitespace-nowrap px-4">
              <Icon name="board" className="size-4" /> มุมครู
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="student" className="gap-2 whitespace-nowrap px-4">
              <Icon name="backpack" className="size-4" /> มุมนักเรียน
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        {/* ---------- มุมครู ---------- */}
        <Tabs.Panel id="teacher" className="p-4 sm:p-6">
          <div className="grid gap-8 md:grid-cols-[1fr_240px]">
            <div>
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  <Avatar.Fallback className="text-xs">{s.short}</Avatar.Fallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted">ฟิสิกส์ · ข้อ 1 · เต็ม 10</p>
                </div>
                {done ? (
                  <Chip size="sm" color="success" variant="soft">ตรวจแล้ว</Chip>
                ) : (
                  <Chip size="sm" variant="soft">รอตรวจ</Chip>
                )}
              </div>

              <div className="mt-6 rounded-xl bg-paper p-5">
                <p className="text-sm text-muted">ทำไมวัตถุจึงตกลงสู่พื้น?</p>
                <p className="mt-2 leading-relaxed">{s.answer}</p>
              </div>

              {done && (
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-semibold tabular-nums text-pen">
                    {graded[idx]}
                    <span className="text-base text-muted">/10</span>
                  </span>
                  <span className="text-sm text-muted">{feedbackBy(graded[idx])}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">ให้คะแนน</p>
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <Button
                    key={n}
                    size="sm"
                    isIconOnly
                    variant={score === n ? "primary" : "tertiary"}
                    onPress={() => setScore(n)}
                    className="tabular-nums"
                  >
                    {n}
                  </Button>
                ))}
              </div>
              <Button onPress={save} isDisabled={score === null} className="mt-1">
                บันทึกคะแนน
              </Button>
              <Button variant="ghost" onPress={next}>
                คนถัดไป <Icon name="arrowRight" className="size-4" />
              </Button>
              <div className="mt-auto pt-2">
                <div className="mb-1.5 flex justify-between text-xs text-muted">
                  <span>ตรวจแล้ว</span>
                  <span className="tabular-nums">
                    {gradedCount}/{students.length}
                  </span>
                </div>
                <ProgressBar aria-label="ความคืบหน้าการตรวจ" value={(gradedCount / students.length) * 100} size="sm">
                  <ProgressBar.Track>
                    <ProgressBar.Fill />
                  </ProgressBar.Track>
                </ProgressBar>
              </div>
            </div>
          </div>
        </Tabs.Panel>

        {/* ---------- มุมนักเรียน ---------- */}
        <Tabs.Panel id="student" className="p-4 sm:p-6">
          <ul className="divide-y divide-line">
            {students.map((st, i) => {
              const g = graded[i];
              return (
                <li key={st.name} className="flex items-center gap-4 py-4">
                  <Avatar size="sm">
                    <Avatar.Fallback className="text-xs">{st.short}</Avatar.Fallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{st.name}</p>
                    <p className="truncate text-sm text-muted">
                      {g !== undefined ? feedbackBy(g) : "รอครูตรวจ"}
                    </p>
                  </div>
                  <span className={`text-lg font-semibold tabular-nums ${g !== undefined ? "text-pen" : "text-muted"}`}>
                    {g !== undefined ? `${g}/10` : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
