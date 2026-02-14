import User from '../models/User.js';
import Event from '../models/Event.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select('-password');
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update user (Admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUserByAdmin = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).select('-password');

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUserByAdmin = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getSystemStats = asyncHandler(async (req, res, next) => {
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    const roomCount = await Room.countDocuments();
    const bookingCount = await Booking.countDocuments();

    res.status(200).json({
        success: true,
        data: {
            users: userCount,
            events: eventCount,
            rooms: roomCount,
            bookings: bookingCount
        }
    });
});
