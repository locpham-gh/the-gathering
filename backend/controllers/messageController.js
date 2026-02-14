import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get messages for a room or event
// @route   GET /api/rooms/:roomId/messages
// @route   GET /api/events/:eventId/messages
// @access  Private
export const getMessages = asyncHandler(async (req, res, next) => {
    const { roomId, eventId } = req.params;
    let query;

    if (roomId) {
        query = { room: roomId };
    } else if (eventId) {
        // Fetch global event messages (where no specific room is assigned)
        query = { event: eventId, room: { $exists: false } };
    } else {
        return next(new ErrorResponse('Please provide a Room ID or Event ID', 400));
    }

    const messages = await Message.find(query)
        .populate('sender', 'username avatar')
        .sort('-createdAt')
        .limit(100);

    res.status(200).json({
        success: true,
        count: messages.length,
        data: messages.reverse(),
    });
});

// @desc    Delete a message (for admin/moderator)
// @route   DELETE /api/messages/:id
// @access  Private (Admin/Host)
export const deleteMessage = asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
        return next(new ErrorResponse(`Message not found with id: ${req.params.id}`, 404));
    }

    // Only sender or admin can delete (simplified check)
    if (message.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to delete this message', 401));
    }

    await message.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});
