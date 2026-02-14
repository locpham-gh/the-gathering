import express from 'express';
import {
    bookEvent,
    getMyBookings,
    cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All booking routes are protected

router.get('/my', getMyBookings);
router.post('/event/:eventId', bookEvent);
router.delete('/:id', cancelBooking);

export default router;
