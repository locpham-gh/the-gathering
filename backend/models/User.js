import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            lowercase: true,
            index: true, // Optimized for identity-based lookups
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
            index: true, // Optimized for login queries
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false, // Security: Always exclude password from queries by default
        },
        avatar: {
            type: String,
            default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            index: true, // Used for RBAC and filtering
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'inactive', 'suspended'],
            default: 'pending',
            index: true, // Useful for filtering active users
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true, // Auto managed 'createdAt' and 'updatedAt'
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound Index: Optimizing common admin queries (e.g., "all active admins")
userSchema.index({ role: 1, status: 1 });

// Middleware: Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// Instance Method: Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
