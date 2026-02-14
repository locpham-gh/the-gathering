import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: [true, 'Message content is required'],
            trim: true,
        },
        event: {
            type: mongoose.Schema.ObjectId,
            ref: 'Event',
            required: true,
        },
        room: {
            type: mongoose.Schema.ObjectId,
            ref: 'Room',
        },
        type: {
            type: String,
            enum: ['text', 'system'],
            default: 'text',
        }
    },
    {
        timestamps: true,
    }
);

// Indexing for high-frequency queries
messageSchema.index({ event: 1 });
messageSchema.index({ room: 1 });
messageSchema.index({ sender: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
