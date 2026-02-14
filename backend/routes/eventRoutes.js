import express from 'express';
import {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    inviteUser,
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getEvents)
    .post(protect, createEvent); // All authenticated users can create events

router.route('/:id')
    .get(getEvent)
    .put(protect, updateEvent) // Ownership/Admin check in controller
    .delete(protect, deleteEvent); // Ownership/Admin check in controller

router.post('/:id/invite', protect, inviteUser);

export default router;
