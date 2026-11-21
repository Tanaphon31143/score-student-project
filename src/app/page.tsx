import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import { GradingDemo } from "./_components/grading-demo";
import { Icon, type IconName } from "./_components/icons";
import { ThemeToggle } from "./_components/theme-toggle";
import { UserMenu } from "./_components/user-menu";

const btnPrimary = `${buttonVariants({ size: "lg" })} bg-ink! text-paper! px-6 transition-opacity hover:opacity-85`;
const btnGhost = `${buttonVariants({ size: "lg", variant: "ghost" })} px-6 text-ink!`;

const features: { icon: IconName; title: string; desc: string }[] = [
  { icon: "upload", title: "ส่งงานง่าย", desc: "แนบไฟล์หรือลิงก์ได้ทุกชนิด ส่งซ้ำได้ เก็บทุกเวอร์ชัน" },
  { icon: "check", title: "ตรวจเร็ว", desc: "ให้คะแนนและคอมเมนต์ได้ในหน้าเดียว ตามเกณฑ์ที่ตั้งไว้" },
  { icon: "chart", title: "เห็นภาพรวม", desc: "รู้ทันทีว่าใครส่งแล้ว ใครยังค้าง และคะแนนเฉลี่ยของห้อง" },
  { icon: "bell", title: "แจ้งเตือน", desc: "เตือนก่อนถึงกำหนดส่ง และแจ้งเมื่อครูตรวจเสร็จ" },
  { icon: "users", title: "หลายห้องเรียน", desc: "แยกงานและคะแนนของแต่ละห้อง แต่ละวิชาชัดเจน" },
  { icon: "history", title: "ประวัติครบ", desc: "ดูย้อนหลังได้ว่าส่งเมื่อไร ตรงเวลาหรือส่งช้า" },
];

const steps = [
  { title: "สร้างห้องเรียน", desc: "ครูตั้งชื่อวิชาและห้องที่สอน" },
  { title: "เพิ่มนักเรียน", desc: "ใส่อีเมลนักเรียน ไม่ต้องสมัครเอง" },
  { title: "มอบหมายงาน", desc: "กำหนดรายละเอียด คะแนนเต็ม และวันส่ง" },
  { title: "ตรวจและคืนคะแนน", desc: "นักเรียนเห็นคะแนนและคอมเมนต์ทันที" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      {/* ===== Navbar: เล็ก อยู่กลาง ขยายเมื่อชี้ ===== */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 px-4">
        <nav className="pointer-events-auto mx-auto flex h-12 w-fit items-center gap-4 rounded-full border border-line bg-surface/80 px-1.5 shadow-sm backdrop-blur-md transition-[gap] duration-500 ease-[cubic-bezier(.2,.9,.3,1)] hover:gap-16 focus-within:gap-16 sm:hover:gap-40 sm:focus-within:gap-40">
          <Link href="/" className="pl-3 text-sm font-semibold tracking-tight">
            ScoreHub
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <UserMenu />
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* ===== Hero ===== */}
        <section className="px-6 pb-20 pt-40 text-center sm:pt-48">
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <span className="size-1.5 rounded-full bg-pen" />
            ระบบส่งงานและตรวจงานออนไลน์
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-[1.15] tracking-tight sm:text-7xl">
            ส่งงาน ตรวจงาน
            <br />
            <span className="text-muted">จบในที่เดียว</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted">
            ครูมอบหมายงานและให้คะแนนได้รวดเร็ว นักเรียนส่งงานและดูคะแนนได้จากทุกอุปกรณ์
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <Link href="/login" className={btnPrimary}>
              เข้าสู่ระบบ
            </Link>
            <a href="#how" className={btnGhost}>
              วิธีใช้งาน <Icon name="arrowDown" className="size-4" />
            </a>
          </div>
        </section>

        {/* ===== ตัวอย่างใช้งาน (กดเล่นได้) ===== */}
        <section id="demo" className="reveal scroll-mt-24 px-6 pb-32">
          <div className="mx-auto max-w-4xl">
            <GradingDemo />
            <p className="mt-4 text-center text-sm text-muted">ลองให้คะแนน แล้วสลับไปดูมุมนักเรียน</p>
          </div>
        </section>

        {/* ===== ฟีเจอร์ ===== */}
        <section className="border-t border-line px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="reveal max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
              ทุกอย่างที่ห้องเรียนต้องใช้
            </h2>
            <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="reveal">
                  <Icon name={f.icon} className="size-5 text-muted" strokeWidth={1.75} />
                  <h3 className="mt-4 font-medium">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== วิธีใช้งาน ===== */}
        <section id="how" className="scroll-mt-24 border-t border-line px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="reveal text-3xl font-semibold tracking-tight sm:text-4xl">เริ่มใช้ใน 4 ขั้น</h2>
            <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="reveal border-t border-ink pt-5">
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  <h3 className="mt-3 font-medium">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="border-t border-line px-6 py-32 text-center">
          <h2 className="reveal mx-auto max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
            พร้อมเริ่มแล้ว?
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-muted">
            ครูเพิ่มนักเรียนเข้าห้องให้ นักเรียนแค่เข้าสู่ระบบด้วย Google
          </p>
          <Link href="/login" className={`${btnPrimary} mt-8`}>
            เข้าสู่ระบบ <Icon name="arrowRight" className="size-4" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-line px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-sm text-muted">
          <span className="font-semibold text-ink">ScoreHub</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
