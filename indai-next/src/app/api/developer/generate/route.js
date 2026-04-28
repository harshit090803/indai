import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ManagedApi from '@/models/ManagedApi';
import crypto from 'crypto';

export async function POST(req) {
    try {
        const { userId, name, description, parameters } = await req.json();

        if (!userId || !name || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Use INDAI to generate the system prompt
        // We call the local assistant with a meta-prompt
        const metaPrompt = `You are the INDAI API Creator. 
        The user wants to create an API called "${name}" which does the following: "${description}".
        It supports these parameters: ${parameters.join(', ')}.
        
        Generate a professional, precise "System Prompt" that will guide an LLM to act as this API. 
        The System Prompt should account for parameters using {{param_name}} syntax.
        Return ONLY the System Prompt text.`;

        const assistantResponse = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: metaPrompt,
                system_prompt: "You are an expert software architect and prompt engineer."
            }),
        });

        if (!assistantResponse.ok) {
            throw new Error('Failed to connect to INDAI Assistant');
        }

        const data = await assistantResponse.json();
        const systemPrompt = data.response;

        await connectToDatabase();
        
        const apiId = crypto.randomBytes(4).toString('hex');
        const newApi = new ManagedApi({
            userId,
            apiId,
            name,
            description,
            systemPrompt,
            parameters,
        });

        await newApi.save();

        return NextResponse.json({ success: true, api: newApi });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
