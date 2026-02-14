import mongoose from 'mongoose';
import slugify from 'slugify';

const forumTopicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Topic title is required'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        slug: String,
        content: {
            type: String,
            required: [true, 'Topic content is required'],
            maxlength: [5000, 'Content cannot be more than 5000 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['general', 'support', 'events', 'announcements', 'feedback'],
            default: 'general',
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        isLocked: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create slug from title before saving
forumTopicSchema.pre('save', function (next) {
    if (!this.isModified('title')) {
        next();
        return;
    }
    this.slug = slugify(this.title, { lower: true, strict: true });
    next();
});

// Virtual for post count
forumTopicSchema.virtual('postCount', {
    ref: 'ForumPost',
    localField: '_id',
    foreignField: 'topic',
    count: true,
});

// Virtual for latest post
forumTopicSchema.virtual('latestPost', {
    ref: 'ForumPost',
    localField: '_id',
    foreignField: 'topic',
    justOne: true,
    options: { sort: { createdAt: -1 } },
});

const ForumTopic = mongoose.model('ForumTopic', forumTopicSchema);

export default ForumTopic;
