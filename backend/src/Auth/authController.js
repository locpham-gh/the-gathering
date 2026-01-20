import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "24h";
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập đầy đủ username, email và password" });
  }

  try {
    // Kiểm tra user tồn tại
    const userExist = await db.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username],
    );
    if (userExist.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Username hoặc Email đã được sử dụng" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Lưu user mới
    const newUser = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role",
      [username, email, passwordHash],
    );

    const user = newUser.rows[0];

    // Tạo token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi đăng ký" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập đầy đủ email và password" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const user = result.rows[0];

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Tạo token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      message: "Đăng nhập thành công",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi đăng nhập" });
  }
};

export const getMe = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, email, role, created_at FROM users WHERE id = $1",
      [req.user.id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("GetMe error:", error);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ khi lấy thông tin người dùng" });
  }
};

export const logout = (req, res) => {
  // Với JWT, logout chủ yếu được xử lý ở client (xóa token).
  // Ở đây có thể trả về thành công.
  res.json({ message: "Đăng xuất thành công" });
};
