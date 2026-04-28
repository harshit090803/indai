import { NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth-utils';
import dbConnect from '@/lib/mongodb';
import ManagedApi from '@/models/ManagedApi';
import User from '@/models/User';

export async function POST(req, { params }) {
    try {
        const { apiId } = params;
        
        // 1. Validate API Key and Usage
        const authResult = await validateApiKey(req);
        if (!authResult.success) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }
        const { user } = authResult;

        await dbConnect();

        // 2. Fetch the Managed API configuration
        const managedApi = await ManagedApi.findOne({ apiId, isActive: true });
        if (!managedApi) {
            return NextResponse.json({ error: 'API not found' }, { status: 404 });
        }

        // 3. Parse Request Body for Parameters
        const body = await req.json().catch(() => ({}));
        
        // 4. Inject Parameters into System Prompt
        let resolvedPrompt = managedApi.systemPrompt;
        managedApi.parameters.forEach(param => {
            const value = body[param] || '[MISSING]';
            const regex = new RegExp(`{{${param}}}`, 'g');
            resolvedPrompt = resolvedPrompt.replace(regex, value);
        });

        // 5. Call INDAI Assistant (Local FastAPI)
        const assistantResponse = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: body.prompt || "Please process the request.",
                system_prompt: resolvedPrompt
            }),
        });

        if (!assistantResponse.ok) {
            throw new Error('Failed to connect to INDAI Assistant');
        }

        const data = await assistantResponse.json();

        // 6. Increment Usage Counter
        await User.findByIdAndUpdate(user._id, { $inc: { currentUsage: 1 } });
        await ManagedApi.findByIdAndUpdate(managedApi._id, { $inc: { usageCount: 1 } });

        return NextResponse.json({
            success: true,
            api_name: managedApi.name,
            response: data.response,
            remaining_quota: user.usageLimit - (user.currentUsage + 1)
        });

    } catch (error) {
        console.error('API Execution Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
