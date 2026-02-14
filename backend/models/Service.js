import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Service name is required'],
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: [true, 'Service description is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['healthcare', 'education', 'legal', 'consulting', 'technology', 'other'],
            default: 'other',
            index: true,
        },
        contactInfo: {
            phone: { type: String, trim: true },
            email: {
                type: String,
                trim: true,
                lowercase: true,
                match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
            },
            website: { type: String, trim: true },
        },
        provider: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Provider (User) is required'],
        },
        location: {
            address: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
            index: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create text index for search
serviceSchema.index({ name: 'text', description: 'text', tags: 'text', 'location.city': 'text' });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
