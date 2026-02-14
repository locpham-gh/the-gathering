import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
        return next(new ErrorResponse('User already exists', 400));
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
        username,
        email,
        password,
        verificationToken,
    });

    if (user) {
        // In production, we would send an email here
        console.log(`Verification Token for ${user.email}: ${verificationToken}`);

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                token: generateToken(user._id),
            }
        });
    } else {
        return next(new ErrorResponse('Invalid user data', 400));
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            return next(new ErrorResponse('Please verify your email before logging in', 401));
        }

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                token: generateToken(user._id),
            }
        });
    } else {
        return next(new ErrorResponse('Invalid email or password', 401));
    }
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationEmail = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    if (user.isVerified) {
        return next(new ErrorResponse('This account is already verified', 400));
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    // In production, send email
    console.log(`NEW Verification Token for ${user.email}: ${verificationToken}`);

    res.status(200).json({
        success: true,
        message: 'Verification token resent successfully'
    });
});

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
        return next(new ErrorResponse('Invalid verification token', 400));
    }

    user.isVerified = true;
    user.status = 'active';
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Email verified successfully'
    });
});

export { registerUser, loginUser, verifyEmail, resendVerificationEmail };
