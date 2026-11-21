// รันไฟล์ SQL ใน db/migrations ตามลำดับชื่อไฟล์ (ทุกไฟล์ต้องรันซ้ำได้ เช่นใช้ IF NOT EXISTS)
// ใช้: npm run db:migrate
import { readdir, readFile } from "node:fs/promises";
import { createConnection } from "mysql2/promise";

const url = new URL(process.env.DATABASE_URL);
const db = await createConnection({
  host: url.hostname,
  port: Number(url.port || 4000),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
  multipleStatements: true,
});

try {
  const dir = new URL("../db/migrations/", import.meta.url);
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    await db.query(await readFile(new URL(file, dir), "utf8"));
    console.log("ok", file);
  }
} finally {
  await db.end();
}
