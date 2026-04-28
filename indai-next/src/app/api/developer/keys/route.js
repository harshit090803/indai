import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function GET(req) {
    try {
        await connectToDatabase();
        // In a real app, get userId from session/cookie
        const userId = req.headers.get('x-user-id'); 
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ keys: user.apiKeys });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { label, userId } = await req.json();

        if (!userId || !label) {
            return NextResponse.json({ error: 'Missing userId or label' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const newKey = `indai_${crypto.randomBytes(16).toString('hex')}`;
        const keyObject = { key: newKey, label, createdAt: new Date() };

        user.apiKeys.push(keyObject);
        await user.save();

        return NextResponse.json({ success: true, key: keyObject });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
