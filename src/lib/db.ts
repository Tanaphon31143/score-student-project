import { createPool } from "mysql2/promise";

/** สร้าง connection pool ไป TiDB จาก DATABASE_URL (TiDB Serverless บังคับ SSL) */
function poolFromUrl(raw: string) {
  const url = new URL(raw);
  return createPool({
    host: url.hostname,
    port: Number(url.port || 4000),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    connectionLimit: 5,
    timezone: "Z",
  });
}

const globalForDb = globalThis as unknown as { pool?: ReturnType<typeof poolFromUrl> };

// ใช้ pool เดิมซ้ำตอน hot reload ระหว่าง dev
export const pool = globalForDb.pool ?? poolFromUrl(process.env.DATABASE_URL!);
if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;
