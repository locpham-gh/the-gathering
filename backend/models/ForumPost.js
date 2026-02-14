import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema(
    {
        topic: {
            type: mongoose.Schema.ObjectId,
            ref: 'ForumTopic',
            required: true,
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: [true, 'Post content is required'],
            maxlength: [2000, 'Post content cannot be more than 2000 characters'],
        },
        parentPost: {
            type: mongoose.Schema.ObjectId,
            ref: 'ForumPost',
            default: null,
        },
        isFlagged: {
            type: Boolean,
            default: false,
        },
        likes: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for child replies
forumPostSchema.virtual('replies', {
    ref: 'ForumPost',
    localField: '_id',
    foreignField: 'parentPost',
});

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

export default ForumPost;
