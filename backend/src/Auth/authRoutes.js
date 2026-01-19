import express from "express";
import { register, login, getMe, logout } from "./authController.js";
import { authenticateToken } from "./authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.post("/logout", authenticateToken, logout);

export default router;
