import express from "express";
import multer from "multer";
import path from "path";
import {
    getResources,
    getResourceById,
    uploadResource,
    updateResource,
    moderateResource
} from "./resourceController.js";
import { authenticateToken, isAdmin } from "../auth/authMiddleware.js";

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Get resources (filtered by status and role inside controller)
router.get("/", authenticateToken, getResources);

// Get single resource
router.get("/:id", authenticateToken, getResourceById);

// Upload a resource with files
router.post("/upload", authenticateToken, upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), uploadResource);

// Update a resource
router.put("/:id", authenticateToken, isAdmin, upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), updateResource);

// Moderate a resource (admin only)
router.patch("/:id/status", authenticateToken, isAdmin, moderateResource);

export default router;
