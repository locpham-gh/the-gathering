import express from "express";
import {
    getRooms,
    createRoom,
    getRoomByCode,
    getRoomMessages,
    sendMessage,
    leaveRoom,
    deleteRoom,
    getAdminRooms,
    toggleRoomStatus,
    getAdminRoomMessages,
    joinRoom
} from "./forumController.js";
import { authenticateToken, isAdmin } from "../auth/authMiddleware.js";

const router = express.Router();

// Tất cả các route forum yêu cầu đăng nhập
router.use(authenticateToken);

// Lấy danh sách phòng
router.get("/rooms", getRooms);

// Tạo phòng mới
router.post("/rooms", createRoom);

// Thoát phòng
router.delete("/rooms/:code/leave", leaveRoom);

// Xoá phòng
router.delete("/rooms/:code", deleteRoom);

// Lấy chi tiết phòng
router.get("/rooms/:code", getRoomByCode);

// Lấy tin nhắn trong phòng
router.get("/rooms/:code/messages", getRoomMessages);

// Gửi tin nhắn
router.post("/rooms/:code/messages", sendMessage);

// Tham gia phòng
router.post("/rooms/:code/join", joinRoom);

// --- ADMIN ROUTES ---
// Lấy tất cả các phòng (Monitor)
router.get("/admin/rooms", isAdmin, getAdminRooms);

// Bật/Tắt trạng thái phòng
router.patch("/admin/rooms/:code/toggle", isAdmin, toggleRoomStatus);

// Giám sát tin nhắn phòng (Monitor)
router.get("/admin/rooms/:code/messages", isAdmin, getAdminRoomMessages);

export default router;
