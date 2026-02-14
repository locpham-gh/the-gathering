import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUserByAdmin,
    deleteUserByAdmin,
    getSystemStats
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are restricted to Admin
router.use(protect, admin);

router.get('/stats', getSystemStats);

router.route('/users')
    .get(getAllUsers);

router.route('/users/:id')
    .get(getUserById)
    .put(updateUserByAdmin)
    .delete(deleteUserByAdmin);

export default router;
