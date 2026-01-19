import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./userController.js";
import { authenticateToken, authorizeRole } from "../Auth/authMiddleware.js";

const router = express.Router();

// Tất cả các route ở đây đều yêu cầu đăng nhập và quyền Admin
router.use(authenticateToken);
router.use(authorizeRole(["admin"]));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
