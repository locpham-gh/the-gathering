import db from "../../config/db.js";

// Lấy danh sách tất cả các phòng
export const getRooms = async (req, res) => {
    try {
        const result = await db.query(`
      SELECT r.*, u.username as creator_name,
      (SELECT COUNT(*) FROM room_members WHERE room_id = r.id) as member_count,
      (SELECT COUNT(*) FROM messages WHERE room_id = r.id) as message_count
      FROM rooms r
      LEFT JOIN users u ON r.creator_id = u.id
      WHERE r.is_active = TRUE
      ORDER BY r.created_at DESC
    `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Tạo phòng mới
export const createRoom = async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;

    if (!title) {
        return res.status(400).json({ success: false, message: "Title is required" });
    }

    try {
        // Tạo mã code ngẫu nhiên
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        await db.query("BEGIN");

        const roomResult = await db.query(
            "INSERT INTO rooms (code, title, creator_id) VALUES ($1, $2, $3) RETURNING *",
            [code, title, userId]
        );

        const roomId = roomResult.rows[0].id;

        // Tự động thêm người tạo vào danh sách thành viên
        await db.query(
            "INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)",
            [roomId, userId]
        );

        await db.query("COMMIT");

        res.status(201).json({ success: true, data: roomResult.rows[0] });
    } catch (error) {
        await db.query("ROLLBACK");
        console.error("Error creating room:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Lấy thông tin chi tiết một phòng theo mã code
export const getRoomByCode = async (req, res) => {
    const { code } = req.params;
    const userId = req.user.id;
    try {
        const result = await db.query(
            `SELECT r.*, u.username as creator_name,
            EXISTS(SELECT 1 FROM room_members WHERE room_id = r.id AND user_id = $2) as is_member
            FROM rooms r 
            LEFT JOIN users u ON r.creator_id = u.id 
            WHERE r.code = $1`,
            [code, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Lấy lịch sử tin nhắn của một phòng
export const getRoomMessages = async (req, res) => {
    const { code } = req.params;
    const userId = req.user.id;
    try {
        const roomResult = await db.query(`
            SELECT r.id, EXISTS(SELECT 1 FROM room_members WHERE room_id = r.id AND user_id = $2) as is_member
            FROM rooms r WHERE r.code = $1
        `, [code, userId]);

        if (roomResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        if (!roomResult.rows[0].is_member) {
            return res.status(403).json({ success: false, message: "Access denied. You must join the room first." });
        }

        const roomId = roomResult.rows[0].id;
        const result = await db.query(
            `SELECT m.*, u.username, u.email,
             pm.content as parent_content, pu.username as parent_username
       FROM messages m 
       JOIN users u ON m.user_id = u.id 
       LEFT JOIN messages pm ON m.parent_id = pm.id
       LEFT JOIN users pu ON pm.user_id = pu.id
       WHERE m.room_id = $1 
       ORDER BY m.created_at ASC`,
            [roomId]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Gửi tin nhắn mới vào phòng
export const sendMessage = async (req, res) => {
    const { code } = req.params;
    const { content, parent_id } = req.body;
    const userId = req.user.id;

    if (!content) {
        return res.status(400).json({ success: false, message: "Content is required" });
    }

    try {
        const roomResult = await db.query(`
            SELECT r.id, EXISTS(SELECT 1 FROM room_members WHERE room_id = r.id AND user_id = $2) as is_member
            FROM rooms r WHERE r.code = $1
        `, [code, userId]);

        if (roomResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        if (!roomResult.rows[0].is_member) {
            return res.status(403).json({ success: false, message: "Access denied. Join the room to chat." });
        }

        const roomId = roomResult.rows[0].id;
        const result = await db.query(
            "INSERT INTO messages (room_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [roomId, userId, content, parent_id || null]
        );

        const messageResult = await db.query(
            `SELECT m.*, u.username, u.email,
             pm.content as parent_content, pu.username as parent_username
       FROM messages m 
       JOIN users u ON m.user_id = u.id 
       LEFT JOIN messages pm ON m.parent_id = pm.id
       LEFT JOIN users pu ON pm.user_id = pu.id
       WHERE m.id = $1`,
            [result.rows[0].id]
        );

        res.json({ success: true, data: messageResult.rows[0] });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Tham gia phòng (Join Room)
export const joinRoom = async (req, res) => {
    const { code } = req.params;
    const userId = req.user.id;

    try {
        const roomResult = await db.query("SELECT id FROM rooms WHERE code = $1", [code]);
        if (roomResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        const roomId = roomResult.rows[0].id;

        // Sử dụng ON CONFLICT để cập nhật last_active_at nếu đã tham gia rồi
        await db.query(
            `INSERT INTO room_members (room_id, user_id) 
       VALUES ($1, $2) 
       ON CONFLICT (room_id, user_id) 
       DO UPDATE SET last_active_at = CURRENT_TIMESTAMP`,
            [roomId, userId]
        );

        res.json({ success: true, message: "Joined room successfully" });
    } catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Thoát phòng (Leave Room)
export const leaveRoom = async (req, res) => {
    const { code } = req.params;
    const userId = req.user.id;

    try {
        const roomResult = await db.query("SELECT id FROM rooms WHERE code = $1", [code]);
        if (roomResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        const roomId = roomResult.rows[0].id;

        await db.query(
            "DELETE FROM room_members WHERE room_id = $1 AND user_id = $2",
            [roomId, userId]
        );

        res.json({ success: true, message: "Left room successfully" });
    } catch (error) {
        console.error("Error leaving room:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Xoá phòng (Delete Room - Chỉ người tạo)
export const deleteRoom = async (req, res) => {
    const { code } = req.params;
    const userId = req.user.id;

    try {
        const roomResult = await db.query("SELECT id, creator_id FROM rooms WHERE code = $1", [code]);
        if (roomResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        if (roomResult.rows[0].creator_id !== userId) {
            return res.status(403).json({ success: false, message: "Only the creator can delete this room" });
        }

        // Thay vì xoá cứng, ta deactivate nó
        await db.query(
            "UPDATE rooms SET is_active = FALSE WHERE code = $1",
            [code]
        );

        res.json({ success: true, message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// --- ADMIN FUNCTIONS ---

// Lấy tất cả các phòng (cho Admin)
export const getAdminRooms = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.*, u.username as creator_name,
            (SELECT COUNT(*) FROM room_members WHERE room_id = r.id) as member_count,
            (SELECT COUNT(*) FROM messages WHERE room_id = r.id) as message_count
            FROM rooms r
            LEFT JOIN users u ON r.creator_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching admin rooms:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Bật/Tắt trạng thái phòng (cho Admin)
export const toggleRoomStatus = async (req, res) => {
    const { code } = req.params;
    const { is_active } = req.body;

    try {
        const result = await db.query(
            "UPDATE rooms SET is_active = $1 WHERE code = $2 RETURNING *",
            [is_active, code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        res.json({ success: true, data: result.rows[0], message: `Room ${is_active ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error("Error toggling room status:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Giám sát tin nhắn (cho Admin - Không cần là member)
export const getAdminRoomMessages = async (req, res) => {
    const { code } = req.params;
    try {
        const roomResult = await db.query("SELECT id, title FROM rooms WHERE code = $1", [code]);

        if (roomResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        const roomId = roomResult.rows[0].id;
        const result = await db.query(
            `SELECT m.*, u.username, u.email,
             pm.content as parent_content, pu.username as parent_username
             FROM messages m 
             JOIN users u ON m.user_id = u.id 
             LEFT JOIN messages pm ON m.parent_id = pm.id
             LEFT JOIN users pu ON pm.user_id = pu.id
             WHERE m.room_id = $1 
             ORDER BY m.created_at ASC`,
            [roomId]
        );

        res.json({ success: true, data: result.rows, room: roomResult.rows[0] });
    } catch (error) {
        console.error("Error fetching admin messages:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
