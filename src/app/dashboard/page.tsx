import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Spinner } from "@heroui/react";
import { getCurrentUser, homeFor } from "@/lib/session";

/** ทางเข้ากลางหลังล็อคอิน: ครู → /teacher, นักเรียน → /student */
async function RedirectByRole(): Promise<null> {
  const user = await getCurrentUser();
  redirect(homeFor(user.role));
}

export default function DashboardPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper">
      <Suspense fallback={<Spinner />}>
        <RedirectByRole />
      </Suspense>
    </div>
  );
}
