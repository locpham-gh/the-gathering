import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import db from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
import authRoutes from "./modules/auth/authRoutes.js";
import userRoutes from "./modules/users/userRoutes.js";
import resourceRoutes from "./modules/resources/resourceRoutes.js";
import forumRoutes from "./modules/forum/forumRoutes.js";

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public/uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/forum", forumRoutes);

// Kiểm tra sức khỏe hệ thống (Health Check)
app.get("/api/health", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      status: "OK",
      time: result.rows[0].now,
      database: "Connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "Error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Route cơ bản
app.get("/", (req, res) => {
  res.send("The Gathering API is running...");
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
