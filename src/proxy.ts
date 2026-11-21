import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/** ไม่มี session cookie = ยังไม่ล็อคอิน ส่งไปหน้า /login (ตรวจบทบาทจริงในหน้าแต่ละหน้า) */
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/:path*", "/student/:path*", "/dashboard"],
};
