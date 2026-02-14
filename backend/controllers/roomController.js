import Room from '../models/Room.js';
import Event from '../models/Event.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create a room for an event
// @route   POST /api/rooms
// @access  Private (Admin/Host)
export const createRoom = asyncHandler(async (req, res, next) => {
    const { event: eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
        return next(new ErrorResponse(`Event not found with id: ${eventId}`, 404));
    }

    // Authorization: Only event host or admin can create rooms
    const isHost = event.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isHost && !isAdmin) {
        return next(new ErrorResponse('Not authorized to create a room for this event', 403));
    }

    const room = await Room.create(req.body);

    res.status(201).json({
        success: true,
        data: room,
    });
});

// @desc    Get all rooms for an event
// @route   GET /api/events/:eventId/rooms
// @access  Public
export const getRoomsByEvent = asyncHandler(async (req, res, next) => {
    const eventId = req.params.eventId || req.query.event;

    if (!eventId) {
        return next(new ErrorResponse('Please provide an event ID', 400));
    }

    const rooms = await Room.find({ event: eventId, isActive: true });

    res.status(200).json({
        success: true,
        count: rooms.length,
        data: rooms,
    });
});

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
export const getRoom = asyncHandler(async (req, res, next) => {
    const room = await Room.findById(req.params.id)
        .populate('event', 'title host')
        .populate('attendees', 'username avatar');

    if (!room) {
        return next(new ErrorResponse(`Room not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: room,
    });
});

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private (Admin/Host)
export const updateRoom = asyncHandler(async (req, res, next) => {
    let room = await Room.findById(req.params.id);

    if (!room) {
        return next(new ErrorResponse(`Room not found with id: ${req.params.id}`, 404));
    }

    const event = await Event.findById(room.event);
    const isHost = event.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isHost && !isAdmin) {
        return next(new ErrorResponse('Not authorized to update this room', 403));
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: room,
    });
});

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin/Host)
export const deleteRoom = asyncHandler(async (req, res, next) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
        return next(new ErrorResponse(`Room not found with id: ${req.params.id}`, 404));
    }

    const event = await Event.findById(room.event);
    const isHost = event.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isHost && !isAdmin) {
        return next(new ErrorResponse('Not authorized to delete this room', 403));
    }

    await room.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});
