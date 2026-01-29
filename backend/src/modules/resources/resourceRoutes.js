import express from "express";
import {
    getResources,
    getResourceById,
    uploadResource,
    moderateResource
} from "./resourceController.js";
import { authenticateToken, isAdmin } from "../Auth/authMiddleware.js";

const router = express.Router();

// Get resources (filtered by status and role inside controller)
router.get("/", authenticateToken, getResources);

// Get single resource
router.get("/:id", authenticateToken, getResourceById);

// Upload a resource (logged in users)
router.post("/", authenticateToken, uploadResource);

// Moderate a resource (admin only)
router.patch("/:id/status", authenticateToken, isAdmin, moderateResource);

export default router;
