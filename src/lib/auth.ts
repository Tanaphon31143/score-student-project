import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { pool } from "./db";

/**
 * ระบบนี้ไม่มีการสมัครสมาชิกเอง — ครูเป็นคนเพิ่มผู้ใช้ (อีเมล) เข้าระบบ
 * แล้วผู้ใช้เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน หรือ Google บัญชีที่อีเมลตรงกัน
 */
export const auth = betterAuth({
  database: pool,
  // ล็อคอินด้วยอีเมล/รหัสผ่านได้ แต่สมัครเองไม่ได้ (ครูตั้งรหัสให้)
  emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 8 },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // อีเมลที่ยังไม่อยู่ในระบบ เข้าไม่ได้ (ไม่สร้างผู้ใช้ใหม่)
      disableSignUp: true,
      prompt: "select_account",
    },
  },
  account: {
    // ผู้ใช้ที่ครูเพิ่มไว้ล่วงหน้า จะผูกกับบัญชี Google อัตโนมัติตอนเข้าครั้งแรก
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },
  user: {
    additionalFields: {
      role: { type: ["teacher", "student"], defaultValue: "student", input: false },
    },
  },
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  plugins: [nextCookies()],
});
