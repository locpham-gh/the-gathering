import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "../../migrations");
  const targetFile = process.argv[2];

  try {
    let files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (targetFile) {
      if (!fs.existsSync(path.join(migrationsDir, targetFile))) {
        console.error(`❌ Không tìm thấy file migration: ${targetFile}`);
        process.exit(1);
      }
      files = [targetFile];
    } else {
      console.log("ℹ️ Đang chạy tất cả migrations...");
    }

    for (const file of files) {
      console.log(`🚀 Đang chạy migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      await db.query(sql);
      console.log(`✅ Hoàn thành migration: ${file}`);
    }

    console.log("🎊 Đã hoàn thành xử lý migration!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi chạy migrations:", error);
    process.exit(1);
  }
}

runMigrations();
