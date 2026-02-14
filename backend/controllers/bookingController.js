import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

/**
 * @desc    Book an event
 * @route   POST /api/events/:eventId/book
 * @access  Private
 */
const bookEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.eventId}`, 404));
    }

    // Check if event is full
    const currentBookings = await Booking.countDocuments({ event: req.params.eventId, status: 'confirmed' });
    if (currentBookings >= event.capacity) {
        return next(new ErrorResponse('Event is already full', 400));
    }

    // Create booking
    let booking;
    try {
        booking = await Booking.create({
            event: req.params.eventId,
            user: req.user.id,
        });
    } catch (err) {
        if (err.code === 11000) {
            return next(new ErrorResponse('You have already booked this event', 400));
        }
        throw err;
    }

    // Send confirmation email
    try {
        await sendBookingConfirmation(req.user, event);
    } catch (err) {
        console.error('Email could not be sent', err);
        // We don't want to fail the booking if email fails, maybe just add a message
    }

    res.status(201).json({
        success: true,
        data: booking,
    });
});

/**
 * @desc    Get my bookings
 * @route   GET /api/bookings/my
 * @access  Private
 */
const getMyBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user.id })
        .populate({
            path: 'event',
            select: 'title description date startTime endTime location meetingLink type',
        });

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
    });
});

/**
 * @desc    Cancel a booking
 * @route   DELETE /api/bookings/:id
 * @access  Private
 */
const cancelBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns booking
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User not authorized to cancel this booking`, 401));
    }

    await booking.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Booking cancelled',
    });
});

export {
    bookEvent,
    getMyBookings,
    cancelBooking,
};
