import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Room name is required'],
            trim: true,
        },
        description: {
            type: String,
        },
        event: {
            type: mongoose.Schema.ObjectId,
            ref: 'Event',
            required: true,
        },
        type: {
            type: String,
            enum: ['breakout', 'private', 'general'],
            default: 'breakout',
        },
        capacity: {
            type: Number,
            default: 10,
        },
        attendees: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        // Metadata for minimap and positioning
        metadata: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            width: { type: Number, default: 100 },
            height: { type: Number, default: 100 },
            color: { type: String, default: '#319795' }, // Default teal color
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexing for performance
roomSchema.index({ event: 1 });

const Room = mongoose.model('Room', roomSchema);

export default Room;
