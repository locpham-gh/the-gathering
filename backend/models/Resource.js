import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            index: true,
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
            index: true,
        },
        description: {
            type: String,
            trim: true,
        },
        thumbnail_url: {
            type: String,
            required: [true, 'Thumbnail URL is required'],
        },
        file_url: {
            type: String,
            required: [true, 'File URL is required'],
        },
        format: {
            type: String,
            enum: ['pdf', 'mp4'],
            required: [true, 'Format is required'],
        },
        content_type: {
            type: String,
            enum: ['guide', 'ebook', 'course'],
            required: [true, 'Content type is required'],
            index: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        isPublic: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Search Index for Title and Author
resourceSchema.index({ title: 'text', author: 'text', description: 'text' });

// Compound Index for filtering
resourceSchema.index({ content_type: 1, isPublic: 1 });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
