import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.ObjectId,
            ref: 'Event',
            required: true,
        },
        inviter: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        recipient: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate invitations for the same event and recipient
invitationSchema.index({ event: 1, recipient: 1 }, { unique: true });

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
