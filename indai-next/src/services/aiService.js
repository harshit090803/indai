/* 
 * Service for handling interactions with Large Language Models (LLM) 
 * and Small Language Models (SLM).
 * 
 * Updated to support local INDAI Assistant bridge.
 */

export const MODEL_TYPES = {
    LLM: 'llm',
    SLM: 'slm',
};

export const aiConfig = {
    activeModelType: process.env.NEXT_PUBLIC_ACTIVE_MODEL || MODEL_TYPES.LLM,
    localAssistantEndpoint: 'http://localhost:8000', // Our new Python FastAPI bridge
    llmEndpoint: process.env.NEXT_PUBLIC_LLM_ENDPOINT || 'http://localhost:8000/v1/chat/completions',
    slmEndpoint: process.env.NEXT_PUBLIC_SLM_ENDPOINT || 'http://localhost:8001/v1/chat/completions',
};

/**
 * Common unified interface to generate a response from either SLM or LLM.
 */
export async function generateAIResponse(prompt, options = {}) {
    const { text } = parsePrompt(prompt);

    // Try Local Assistant FIRST for "Smart Tasks"
    try {
        console.log("Attempting to connect to local INDAI Assistant...");
        const response = await fetch(`${aiConfig.localAssistantEndpoint}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        if (response.ok) {
            const data = await response.json();
            return data.response;
        }
    } catch (e) {
        console.warn("Local Assistant not running, falling back to mock AI.");
    }

    // Fallback to existing mock logic
    const modelType = options.modelType || aiConfig.activeModelType;
    if (modelType === MODEL_TYPES.SLM) {
        return await callSLM(prompt, options);
    } else {
        return await callLLM(prompt, options);
    }
}

/**
 * Executes a system command via the local bridge.
 */
export async function executeSystemCommand(command) {
    try {
        const response = await fetch(`${aiConfig.localAssistantEndpoint}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command })
        });
        if (response.ok) {
            const data = await response.json();
            return data.result;
        }
        return "Failed to execute command on local system.";
    } catch (e) {
        return "Local Assistant bridge is not connected. Please start the Python app.";
    }
}

function parsePrompt(prompt) {
    let text = prompt;
    let attachments = [];
    if (typeof prompt === 'object' && prompt !== null) {
        text = prompt.text || '';
        attachments = prompt.attachments || [];
    }
    return { text, attachments };
}

async function callSLM(prompt, options) {
    const { text } = parsePrompt(prompt);
    // Mock response
    return `[Mock SLM]: I am currently in offline mode. Please start the INDAI Assistant for real-time tasks. You asked: "${text}"`;
}

async function callLLM(prompt, options) {
    const { text } = parsePrompt(prompt);
    // Mock response
    return `[Mock LLM]: Advanced reasoning is simulated. Connect to the local backend for system execution. You asked: "${text}"`;
}
