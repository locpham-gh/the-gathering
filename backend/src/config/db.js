// server/src/config/db.js
import "dotenv/config";
import { Pool } from "pg";

// Khởi tạo Pool kết nối
const pool = new Pool({
  user: process.env.DB_USER, // ví dụ: 'postgres'
  host: process.env.DB_HOST, // ví dụ: 'localhost' hoặc 'db' (nếu dùng Docker)
  database: process.env.DB_NAME, // tên database bạn đã tạo
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // Tối đa 20 kết nối trong pool
  idleTimeoutMillis: 30000, // Đóng kết nối nếu không dùng sau 30s
  connectionTimeoutMillis: 2000, // Trả về lỗi nếu không thể kết nối sau 2s
});

// Kiểm tra kết nối khi khởi động server
pool.on("connect", () => {
  console.log("✅ Đã kết nối thành công với PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Lỗi kết nối PostgreSQL bất ngờ:", err);
  process.exit(-1);
});

export default {
  query: (text, params) => pool.query(text, params), // Helper để thực hiện truy vấn
  pool: pool, // Xuất pool nếu cần dùng cho Transaction
};
