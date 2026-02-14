import Event from '../models/Event.js';
import User from '../models/User.js';
import Invitation from '../models/Invitation.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

/**
 * @desc    Get all events (for calendar/list)
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = asyncHandler(async (req, res, next) => {
    const events = await Event.find()
        .populate({
            path: 'host',
            select: 'username avatar',
        })
        .populate('remainingCapacity');

    res.status(200).json({
        success: true,
        count: events.length,
        data: events,
    });
});

/**
 * @desc    Get single event
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id)
        .populate({
            path: 'host',
            select: 'username avatar',
        })
        .populate('remainingCapacity');

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: event,
    });
});

/**
 * @desc    Create an event
 * @route   POST /api/events
 * @access  Private (Admin/Host)
 */
const createEvent = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.host = req.user.id;

    const event = await Event.create(req.body);

    res.status(201).json({
        success: true,
        data: event,
    });
});

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (Host/Admin)
 */
const updateEvent = asyncHandler(async (req, res, next) => {
    let event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is event host or admin
    if (event.host.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this event`, 401));
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: event,
    });
});

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (Host/Admin)
 */
const deleteEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is event host or admin
    if (event.host.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this event`, 401));
    }

    await event.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Event removed',
    });
});

/**
 * @desc    Invite a user to an event
 * @route   POST /api/events/:id/invite
 * @access  Private (Host)
 */
const inviteUser = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
    }

    // Only host or admin can invite
    if (event.host.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to invite users to this event`, 401));
    }

    const recipient = await User.findOne({ email });
    if (!recipient) {
        return next(new ErrorResponse(`User with email ${email} not found`, 404));
    }

    try {
        const invitation = await Invitation.create({
            event: event._id,
            inviter: req.user.id,
            recipient: recipient._id,
        });

        res.status(201).json({
            success: true,
            data: invitation,
        });
    } catch (err) {
        if (err.code === 11000) {
            return next(new ErrorResponse('User already invited to this event', 400));
        }
        throw err;
    }
});

export {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    inviteUser,
};
