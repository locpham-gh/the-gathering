import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                phoneNumber: user.phoneNumber,
                role: user.role,
                status: user.status,
                isVerified: user.isVerified,
            }
        });
    } else {
        return next(new ErrorResponse('User not found', 404));
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Sanitize updates
        user.username = req.body.username || user.username;
        user.avatar = req.body.avatar || user.avatar;
        user.bio = req.body.bio || user.bio;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            data: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                bio: updatedUser.bio,
                phoneNumber: updatedUser.phoneNumber,
                role: updatedUser.role,
                status: updatedUser.status,
                isVerified: updatedUser.isVerified,
                token: generateToken(updatedUser._id),
            }
        });
    } else {
        return next(new ErrorResponse('User not found', 404));
    }
});

export { getUserProfile, updateUserProfile };
