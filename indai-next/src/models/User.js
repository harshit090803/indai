import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    apiKeys: [
        {
            key: String,
            label: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    usageLimit: {
        type: Number,
        default: 1000
    },
    currentUsage: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
