import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.ObjectId,
            ref: 'Event',
            required: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'confirmed', // Assuming auto-confirmation for now
        },
        bookedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent user from booking the same event twice
bookingSchema.index({ event: 1, user: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
