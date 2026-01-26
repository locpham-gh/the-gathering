import express from "express";
import { getResources, getResourceById } from "./resourceController.js";
import { authenticateToken } from "../Auth/authMiddleware.js";

const router = express.Router();

// Publicly available (or protected by token if required)
// In this case, we'll require token to access the "Library"
router.get("/", authenticateToken, getResources);
router.get("/:id", authenticateToken, getResourceById);

export default router;
