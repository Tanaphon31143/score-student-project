// เพิ่มผู้ใช้เข้าระบบ (ใช้เพิ่มครูคนแรก หรือเพิ่มนักเรียนจาก command line)
// ใช้: npm run user:add -- <email> "<ชื่อ>" [teacher|student] [รหัสผ่าน]
// - ใส่รหัสผ่าน: เข้าสู่ระบบด้วยอีเมล/รหัสผ่านได้ (อย่างน้อย 8 ตัว)
// - ไม่ใส่รหัสผ่าน: เข้าสู่ระบบด้วย Google บัญชีที่อีเมลตรงกันได้อย่างเดียว
// รันซ้ำกับอีเมลเดิม = อัปเดตชื่อ/บทบาท/รหัสผ่าน
import { randomUUID } from "node:crypto";
import { createConnection } from "mysql2/promise";
import { hashPassword } from "better-auth/crypto";

const [rawEmail, name, role = "student", password] = process.argv.slice(2);
const email = rawEmail?.toLowerCase().trim();

if (!email || !name || !["teacher", "student"].includes(role)) {
  console.error('ใช้: npm run user:add -- <email> "<ชื่อ>" [teacher|student] [รหัสผ่าน]');
  process.exit(1);
}
if (password !== undefined && password.length < 8) {
  console.error("รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร");
  process.exit(1);
}

const url = new URL(process.env.DATABASE_URL);
const db = await createConnection({
  host: url.hostname,
  port: Number(url.port || 4000),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
});

try {
  const now = new Date();
  await db.execute(
    `INSERT INTO \`user\` (id, name, email, emailVerified, role, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), updatedAt = VALUES(updatedAt)`,
    [randomUUID(), name, email, true, role, now, now],
  );

  if (password) {
    const [[user]] = await db.execute("SELECT id FROM `user` WHERE email = ?", [email]);
    const hash = await hashPassword(password);
    const [[existing]] = await db.execute(
      "SELECT id FROM `account` WHERE userId = ? AND providerId = 'credential'",
      [user.id],
    );
    if (existing) {
      await db.execute("UPDATE `account` SET password = ?, updatedAt = ? WHERE id = ?", [hash, now, existing.id]);
    } else {
      await db.execute(
        `INSERT INTO \`account\` (id, accountId, providerId, userId, password, createdAt, updatedAt)
         VALUES (?, ?, 'credential', ?, ?, ?, ?)`,
        [randomUUID(), user.id, user.id, hash, now, now],
      );
    }
  }

  console.log(
    `เพิ่ม ${email} (${role}) แล้ว — ${password ? "เข้าสู่ระบบด้วยอีเมล/รหัสผ่าน หรือ Google ได้" : "เข้าสู่ระบบด้วย Google ได้"}`,
  );
} finally {
  await db.end();
}
