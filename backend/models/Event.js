import mongoose from 'mongoose';
import slugify from 'slugify';

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Event title is required'],
            trim: true,
        },
        slug: String,
        description: {
            type: String,
            required: [true, 'Event description is required'],
        },
        type: {
            type: String,
            enum: ['virtual', 'in-person'],
            default: 'virtual',
        },
        date: {
            type: Date,
            required: [true, 'Event date is required'],
        },
        startTime: {
            type: String,
            required: [true, 'Start time is required'], // HH:mm format
        },
        endTime: {
            type: String,
            required: [true, 'End time is required'], // HH:mm format
        },
        location: {
            type: String,
            required: function () {
                return this.type === 'in-person';
            },
        },
        meetingLink: {
            type: String,
            required: function () {
                return this.type === 'virtual';
            },
        },
        host: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [20, 'Minimum capacity is 20'],
            max: [100, 'Maximum capacity is 100'],
        },
        hasBreakoutRooms: {
            type: Boolean,
            default: false,
        },
        breakoutRoomConfig: {
            roomCount: { type: Number, default: 0 },
            maxPerRoom: { type: Number, default: 0 },
            roomLinks: [String],
        },
        status: {
            type: String,
            enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
            default: 'scheduled',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create slug from title before saving
eventSchema.pre('save', function (next) {
    if (!this.isModified('title')) {
        next();
        return;
    }
    this.slug = slugify(this.title, { lower: true, strict: true });
    next();
});

// Virtual for remaining capacity
eventSchema.virtual('remainingCapacity', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'event',
    count: true,
    match: { status: 'confirmed' },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
