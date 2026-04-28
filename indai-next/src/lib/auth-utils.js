import dbConnect from './mongodb';
import User from '../models/User';

export async function validateApiKey(req) {
    const apiKey = req.headers.get('x-api-key') || req.headers.get('Authorization')?.split(' ')[1];

    if (!apiKey) {
        return { success: false, error: 'API Key is missing' };
    }

    await dbConnect();

    // Search for user with this API key
    const user = await User.findOne({ 
        'apiKeys.key': apiKey 
    });

    if (!user) {
        return { success: false, error: 'Invalid API Key' };
    }

    // Check if user is within usage limits
    if (user.currentUsage >= user.usageLimit) {
        return { success: false, error: 'Usage limit reached. Please upgrade your plan.' };
    }

    return { success: true, user };
}
