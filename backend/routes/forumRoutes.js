import express from 'express';
import {
    getTopics,
    getTopic,
    createTopic,
    updateTopic,
    createPost,
    flagPost,
    moderateTopic
} from '../controllers/forumController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Topic routes
router.route('/topics')
    .get(getTopics)
    .post(protect, createTopic);

router.route('/topics/:id')
    .get(getTopic)
    .put(protect, updateTopic);

// Post routes
router.route('/topics/:topicId/posts')
    .post(protect, createPost);

// Moderation routes
router.put('/posts/:id/flag', protect, flagPost);

router.put('/topics/:id/moderate', protect, authorize('admin'), moderateTopic);

export default router;
