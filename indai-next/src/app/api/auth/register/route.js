import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if user already exists
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return NextResponse.json(
                { success: false, message: 'Email already registered' },
                { status: 409 }
            );
        }

        // Create user (password is automatically hashed by the Mongoose pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
        });

        // Normally we'd return a JWT token here. For this phase, we just return success.
        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
