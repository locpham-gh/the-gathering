import express from 'express';
import {
    createRoom,
    getRoomsByEvent,
    getRoom,
    updateRoom,
    deleteRoom
} from '../controllers/roomController.js';
import { getMessages, deleteMessage } from '../controllers/messageController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getRoomsByEvent)
    .post(protect, createRoom);

router.route('/:id')
    .get(getRoom)
    .put(protect, updateRoom)
    .delete(protect, deleteRoom);

router.route('/:roomId/messages')
    .get(protect, getMessages);

router.route('/messages/:id')
    .delete(protect, authorize('admin', 'host'), deleteMessage);

export default router;
