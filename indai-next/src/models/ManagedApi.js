import mongoose from 'mongoose';

const ManagedApiSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        apiId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            maxlength: [100, 'Name cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: true,
        },
        systemPrompt: {
            type: String,
            required: true,
        },
        parameters: {
            type: [String],
            default: [],
        },
        usageCount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.ManagedApi || mongoose.model('ManagedApi', ManagedApiSchema);
