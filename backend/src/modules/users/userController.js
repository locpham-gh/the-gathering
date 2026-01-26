import db from "../../config/db.js";
import bcrypt from "bcryptjs";

// Lấy tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GetAllUsers error:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
  }
};

// Lấy chi tiết một người dùng
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT id, username, email, role, created_at FROM users WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("GetUserById error:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
  }
};

// Cập nhật người dùng (Username, Email, Role)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  try {
    const result = await db.query(
      "UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), role = COALESCE($3, role), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, username, email, role",
      [username, email, role, id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để cập nhật" });
    }

    res.json({ message: "Cập nhật thành công", user: result.rows[0] });
  } catch (error) {
    console.error("UpdateUser error:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật người dùng" });
  }
};

// Xóa người dùng
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để xóa" });
    }

    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    console.error("DeleteUser error:", error);
    res.status(500).json({ message: "Lỗi khi xóa người dùng" });
  }
};
