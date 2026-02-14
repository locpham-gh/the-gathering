import ForumTopic from '../models/ForumTopic.js';
import ForumPost from '../models/ForumPost.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// --- Topic Controllers ---

/**
 * @desc    Get all topics with filtering and pagination
 * @route   GET /api/forum/topics
 * @access  Public
 */
const getTopics = asyncHandler(async (req, res, next) => {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const topics = await ForumTopic.find(query)
        .populate('author', 'username avatar')
        .populate('postCount')
        .populate({
            path: 'latestPost',
            populate: { path: 'author', select: 'username avatar' }
        })
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await ForumTopic.countDocuments(query);

    res.status(200).json({
        success: true,
        count: topics.length,
        total,
        pages: Math.ceil(total / limitNum),
        data: topics,
    });
});

/**
 * @desc    Get single topic with its posts (threaded)
 * @route   GET /api/forum/topics/:id
 * @access  Public
 */
const getTopic = asyncHandler(async (req, res, next) => {
    const topic = await ForumTopic.findById(req.params.id)
        .populate('author', 'username avatar');

    if (!topic) {
        return next(new ErrorResponse(`Topic not found with id of ${req.params.id}`, 404));
    }

    // Increment views
    topic.views += 1;
    await topic.save();

    // Get posts for this topic (only top-level posts, replies are handled by virtuals or separate route)
    const posts = await ForumPost.find({ topic: req.params.id, parentPost: null })
        .populate('author', 'username avatar')
        .populate({
            path: 'replies',
            populate: { path: 'author', select: 'username avatar' }
        });

    res.status(200).json({
        success: true,
        data: {
            topic,
            posts
        },
    });
});

/**
 * @desc    Create a topic
 * @route   POST /api/forum/topics
 * @access  Private
 */
const createTopic = asyncHandler(async (req, res, next) => {
    req.body.author = req.user.id;

    const topic = await ForumTopic.create(req.body);

    res.status(201).json({
        success: true,
        data: topic,
    });
});

/**
 * @desc    Update a topic
 * @route   PUT /api/forum/topics/:id
 * @access  Private
 */
const updateTopic = asyncHandler(async (req, res, next) => {
    let topic = await ForumTopic.findById(req.params.id);

    if (!topic) {
        return next(new ErrorResponse(`Topic not found`, 404));
    }

    // Authorization
    if (topic.author.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized`, 401));
    }

    topic = await ForumTopic.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: topic,
    });
});

// --- Post Controllers ---

/**
 * @desc    Create a post/reply
 * @route   POST /api/forum/topics/:topicId/posts
 * @access  Private
 */
const createPost = asyncHandler(async (req, res, next) => {
    const topic = await ForumTopic.findById(req.params.topicId);

    if (!topic) {
        return next(new ErrorResponse(`Topic not found`, 404));
    }

    if (topic.isLocked && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Topic is locked`, 400));
    }

    req.body.topic = req.params.topicId;
    req.body.author = req.user.id;

    const post = await ForumPost.create(req.body);

    res.status(201).json({
        success: true,
        data: post,
    });
});

/**
 * @desc    Flag a post for moderation
 * @route   PUT /api/forum/posts/:id/flag
 * @access  Private
 */
const flagPost = asyncHandler(async (req, res, next) => {
    const post = await ForumPost.findByIdAndUpdate(req.params.id, { isFlagged: true }, { new: true });

    if (!post) {
        return next(new ErrorResponse(`Post not found`, 404));
    }

    res.status(200).json({
        success: true,
        message: 'Post flagged for moderation',
    });
});

/**
 * @desc    Moderate a topic (Lock/Pin)
 * @route   PUT /api/forum/topics/:id/moderate
 * @access  Private/Admin
 */
const moderateTopic = asyncHandler(async (req, res, next) => {
    const { isPinned, isLocked } = req.body;

    const topic = await ForumTopic.findByIdAndUpdate(
        req.params.id,
        { isPinned, isLocked },
        { new: true, runValidators: true }
    );

    if (!topic) {
        return next(new ErrorResponse(`Topic not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: topic,
    });
});

export {
    getTopics,
    getTopic,
    createTopic,
    updateTopic,
    createPost,
    flagPost,
    moderateTopic
};
