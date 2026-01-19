import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "../migrations");

  try {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      console.log(`🚀 Đang chạy migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      await db.query(sql);
      console.log(`✅ Hoàn thành migration: ${file}`);
    }

    console.log("🎊 Tất cả migrations đã được thực hiện thành công!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi chạy migrations:", error);
    process.exit(1);
  }
}

runMigrations();
