import express from 'express';
import {
    getResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
} from '../controllers/resourceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getResources);
router.get('/:id', getResourceById);

// Admin only routes
router.post('/', protect, admin, createResource);
router.put('/:id', protect, admin, updateResource);
router.delete('/:id', protect, admin, deleteResource);

export default router;
