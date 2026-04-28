"use client";
import React, { useState, useEffect, useRef } from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';
import { Send, X, AlertTriangle, ArrowRightCircle, MessageSquarePlus, MessageSquare, Paperclip, Image as ImageIcon, Mic, StopCircle, XCircle, FileText, PhoneOff, Waveform, Trash2, Ghost, Pencil, Check, Copy, User as UserIcon, LogOut } from 'lucide-react';
import mammoth from 'mammoth';
// PDF and OCR libraries will be dynamically imported to avoid Next.js SSR 'DOMMatrix is not defined' errors

import './Chatbox.css';
import { generateAIResponse } from '../services/aiService';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '../lib/api';

const generalTranslations = {
    en: "General", hi: "सामान्य", bn: "সাধারণ", kn: "ಸಾಮಾನ್ಯ", ta: "பொது"
};

const localizedStrings = {
    en: {
        welcome: (topic) => `Welcome to the ${topic} chat.How can I help you today ? `,
        simulatedResponse: (topic) => `This is a simulated response regarding ${topic}.`,
        redirected: (topic) => `Redirected to ${topic}.Welcome!`,
        answering: (topic) => `I am answering your question about ${topic} now!`,
        placeholder: "Type your question...",
        outOfScopeTitle: "Out of Scope",
        outOfScopeBody1: (topic) => `Your question seems to be beyond the scope of `,
        outOfScopeBody2: (topic) => `Would you like to redirect to `,
        cancel: "Cancel",
        redirect: "Redirect",
        tip: "Tip: type \"what about [another topic]\" or \"out of scope\" to trigger redirect.",
        andAskThere: " and ask there?",
        chatbotTitle: "Chat:",
        historyTitle: "Recent Chats",
        noHistory: "No recent chats.",
        newChat: "New Chat"
    },
    hi: {
        welcome: (topic) => `${topic} चैट में आपका स्वागत है। आज मैं आपकी कैसे मदद कर सकता हूँ ? `,
        simulatedResponse: (topic) => `यह ${topic} के संबंध में एक नकली प्रतिक्रिया है।`,
        redirected: (topic) => `${topic} पर पुनर्निर्देशित किया गया। स्वागत है!`,
        answering: (topic) => `मैं अब ${topic} के बारे में आपके प्रश्न का उत्तर दे रहा हूँ!`,
        placeholder: "अपना प्रश्न टाइप करें...",
        outOfScopeTitle: "दायरे से बाहर",
        outOfScopeBody1: (topic) => `आपका प्रश्न इसके दायरे से बाहर लगता है: `,
        outOfScopeBody2: (topic) => `क्या आप पुनर्निर्देशित होना चाहेंगे: `,
        cancel: "रद्द करें",
        redirect: "पुनर्निर्देशित करें",
        tip: "सुझाव: पुनर्निर्देशन के लिए \"out of scope\" या किसी विषय का नाम टाइप करें।",
        andAskThere: "?",
        chatbotTitle: "चैट:",
        historyTitle: "हाल की चैट",
        noHistory: "कोई हाल की चैट नहीं।",
        newChat: "नई चैट"
    },
    bn: {
        welcome: (topic) => `${topic} চ্যাটে স্বাগতম। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি ? `,
        simulatedResponse: (topic) => `এটি ${topic} সম্পর্কে একটি সিমুলেটেড প্রতিক্রিয়া।`,
        redirected: (topic) => `${topic} তে পুনর্নির্দেশ করা হয়েছে। স্বাগতম!`,
        answering: (topic) => `আমি এখন ${topic} সম্পর্কে আপনার প্রশ্নের উত্তর দিচ্ছি!`,
        placeholder: "আপনার প্রশ্ন টাইপ করুন...",
        outOfScopeTitle: "সুযোগের বাইরে",
        outOfScopeBody1: (topic) => `আপনার প্রশ্নটি এর সুযোগের বাইরে বলে মনে হচ্ছে: `,
        outOfScopeBody2: (topic) => `আপনি কি এখানে পুনর্নির্দেশ করতে চান: `,
        cancel: "বাতিল",
        redirect: "পুনর্নির্দেশ",
        tip: "টিপ: পুনর্নির্দেশের জন্য অন্য বিষয়ের নাম টাইপ করুন।",
        andAskThere: "?",
        chatbotTitle: "চ্যাট:",
        historyTitle: "সাম্প্রতিক চ্যাট",
        noHistory: "কোনও সাম্প্রতিক চ্যাট নেই।",
        newChat: "নতুন চ্যাট"
    },
    kn: {
        welcome: (topic) => `${topic} ಚಾಟ್‌ಗೆ ಸುಸ್ವಾಗತ.ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು ? `,
        simulatedResponse: (topic) => `ಇದು ${topic} ಕುರಿತಾದ ಸಿಮ್ಯುಲೇಟೆಡ್ ಪ್ರತಿಕ್ರಿಯೆಯಾಗಿದೆ.`,
        redirected: (topic) => `${topic} ಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗಿದೆ.ಸುಸ್ವಾಗತ!`,
        answering: (topic) => `ನಾನು ಈಗ ${topic} ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸುತ್ತಿದ್ದೇನೆ!`,
        placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ...",
        outOfScopeTitle: "ವ್ಯಾಪ್ತಿಯಿಂದ ಹೊರಗಿದೆ",
        outOfScopeBody1: (topic) => `ನಿಮ್ಮ ಪ್ರಶ್ನೆಯು ಇದರ ವ್ಯಾಪ್ತಿಯನ್ನು ಮೀರಿದೆ ಎಂದು ತೋರುತ್ತದೆ: `,
        outOfScopeBody2: (topic) => `ನೀವು ಇಲ್ಲಿಗೆ ಮರುನಿರ್ದೇಶಿಸಲು ಬಯಸುವಿರಾ: `,
        cancel: "ರದ್ದುಮಾಡಿ",
        redirect: "ಮರುನಿರ್ದೇಶಿಸು",
        tip: "ಸುಳಿವು: ಮರುನಿರ್ದೇಶನಕ್ಕಾಗಿ ಬೇರೆ ವಿಷಯದ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ.",
        andAskThere: "?",
        chatbotTitle: "ಚಾಟ್:",
        historyTitle: "ಇತ್ತೀಚಿನ ಚಾಟ್‌ಗಳು",
        noHistory: "ಯಾವುದೇ ಇತ್ತೀಚಿನ ಚಾಟ್‌ಗಳಿಲ್ಲ.",
        newChat: "ಹೊಸ ಚಾಟ್"
    },
    ta: {
        welcome: (topic) => `${topic} அரட்டைக்கு வரவேற்கிறோம்.இன்று நான் உங்களுக்கு எப்படி உதவ முடியும் ? `,
        simulatedResponse: (topic) => `இது ${topic} பற்றிய ஒரு உருவகப்படுத்தப்பட்ட பதில்.`,
        redirected: (topic) => `${topic} க்கு மாற்றப்பட்டது.நல்வரவு!`,
        answering: (topic) => `இப்போது ${topic} பற்றிய உங்கள் கேள்விக்கு நான் பதிலளிக்கிறேன்!`,
        placeholder: "உங்கள் கேள்வியைத் தட்டச்சு செய்க...",
        outOfScopeTitle: "வரம்பிற்கு வெளியே",
        outOfScopeBody1: (topic) => `உங்கள் கேள்வி இதற்கான வரம்பிற்கு வெளியே இருப்பதாகத் தெரிகிறது: `,
        outOfScopeBody2: (topic) => `நீங்கள் இங்கு செல்ல விரும்புகிறீர்களா: `,
        cancel: "ரத்துசெய்",
        redirect: "வழிமாற்று",
        tip: "உதவிக்குறிப்பு: வழிமாற்றுவதற்கு மற்றொரு தலைப்பின் பெயரைத் தட்டச்சு செய்க.",
        andAskThere: "?",
        chatbotTitle: "அரட்டை:",
        historyTitle: "சமீபத்திய அரட்டைகள்",
        noHistory: "சமீபத்திய அரட்டைகள் இல்லை.",
        newChat: "புதிய அரட்டை"
        newChat: "New Chat"
    }
};

const TypewriterMessage = ({ text }) => {
    const [displayText, setDisplayText] = useState('');
    const isShort = text.length < 50;
    
    useEffect(() => {
        if (isShort) {
            setDisplayText(text);
            return;
        }
        
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(text.slice(0, i + 1));
            i += 2; // Jump by 2 chars for faster typing illusion
            if (i >= text.length) {
                setDisplayText(text);
                clearInterval(interval);
            }
        }, 15);
        
        return () => clearInterval(interval);
    }, [text, isShort]);

    return (
        <div 
            style={{ whiteSpace: 'pre-wrap', cursor: isShort ? 'default' : 'pointer' }}
            onClick={() => { if (!isShort) setDisplayText(text); }}
            title={isShort ? "" : "Click to reveal full message"}
        >
            {displayText}
        </div>
    );
};

const Chatbox = ({ topic, language, onClose, onTopicChange, allTopics }) => {
    const t = localizedStrings[language] || localizedStrings['en'];
    const generalEquivalent = generalTranslations[language] || "General";

    const [sessionList, setSessionList] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    const [input, setInput] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [redirectTopic, setRedirectTopic] = useState('');
    const [pendingQuestion, setPendingQuestion] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editInput, setEditInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const messagesEndRef = useRef(null);

    // Sync historical chats from Django Cloud API on load
    useEffect(() => {
        const syncCloudChats = async () => {
            try {
                const res = await fetchWithAuth('/chat');
                if (res.ok) {
                    const data = await res.json();
                    if (data.messages && data.messages.length > 0) {
                        console.log("Cloud sync successful, found", data.messages.length, "messages.");
                        // Future improvement: Merge cloud messages into local sessionList here
                    }
                }
            } catch (err) {
                console.error("Failed to fetch cloud chats", err);
            }
        };
        syncCloudChats();
    }, []);

    // Multimodal States
    const [attachments, setAttachments] = useState([]); // Array of { type, url, name, file }
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    // Live Voice Mode States
    const [isLiveVoiceMode, setIsLiveVoiceMode] = useState(false);
    const [liveSubtitle, setLiveSubtitle] = useState('Initializing...');
    const [aiSpeaking, setAiSpeaking] = useState(false);

    // Web Speech API Refs
    const recognitionRef = useRef(null);
    const synthesisRef = useRef(null);
    const utteranceRef = useRef(null);
    const liveTopicRef = useRef(topic);
    const isVoiceModeRef = useRef(false);
    const isAiSpeakingRef = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 1. Initial Load & Migration
    useEffect(() => {
        let listStr = localStorage.getItem(`sessionList_${language} `);
        let list = listStr ? JSON.parse(listStr) : [];

        // Migrate legacy formats
        let migrated = false;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`chat_${language} _`)) {
                const topicName = key.replace(`chat_${language} _`, '');
                const msgsStr = localStorage.getItem(key);
                if (msgsStr) {
                    try {
                        const msgs = JSON.parse(msgsStr);
                        const newId = 'migrated_' + Date.now().toString() + Math.random().toString(36).substr(2, 5);
                        const userMsgs = msgs.filter(m => m.sender === 'user');
                        const preview = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].text : "Chat";
                        list.push({ id: newId, topic: topicName, preview: preview.substring(0, 30), timestamp: Date.now() });
                        localStorage.setItem(`messages_${newId} `, msgsStr);
                        localStorage.removeItem(key);
                        migrated = true;
                    } catch (e) { }
                }
            }
        }

        if (migrated) {
            localStorage.setItem(`sessionList_${language} `, JSON.stringify(list));
        }

        list.sort((a, b) => b.timestamp - a.timestamp);
        setSessionList(list);
        setIsLoaded(true);
    }, [language]);

    // 2. Select appropriate session when topic changes
    useEffect(() => {
        if (!isLoaded) return;

        const filtered = topic === generalEquivalent ? sessionList : sessionList.filter(s => s.topic === topic);

        // If current session is invalid for this topic, pick the first or create new
        if (!currentSessionId || !filtered.find(s => s.id === currentSessionId)) {
            if (filtered.length > 0) {
                setCurrentSessionId(filtered[0].id);
            } else {
                handleNewChat(topic);
            }
        }
    }, [isLoaded, topic, sessionList]); // Need sessionList here so newly created sessions are caught, but handleNewChat updates both so it's fine.

    // 3. Load messages when currentSessionId changes
    useEffect(() => {
        if (currentSessionId) {
            const msgsStr = localStorage.getItem(`messages_${currentSessionId} `);
            if (msgsStr) {
                setMessages(JSON.parse(msgsStr));
            } else {
                setMessages([]);
            }
        }
    }, [currentSessionId, topic]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 4. Update messages & session list preview when messages change
    useEffect(() => {
        if (currentSessionId && messages.length > 0) {
            localStorage.setItem(`messages_${currentSessionId} `, JSON.stringify(messages));

            const userMsgs = messages.filter(m => m.sender === 'user');
            if (userMsgs.length > 0) {
                // Use the FIRST user message as the permanent name of the chat natively
                const firstUserMsg = userMsgs[0];
                const newPreview = firstUserMsg.text.substring(0, 30);

                setSessionList(prev => {
                    const idx = prev.findIndex(s => s.id === currentSessionId);
                    if (idx !== -1 && prev[idx].preview !== newPreview) {
                        const newList = [...prev];
                        newList[idx] = { ...newList[idx], preview: newPreview, timestamp: Date.now() };
                        newList.sort((a, b) => b.timestamp - a.timestamp);
                        localStorage.setItem(`sessionList_${language} `, JSON.stringify(newList.filter(s => !s.isTemporary)));
                        return newList;
                    }
                    return prev;
                });
            }
        }
    }, [messages, currentSessionId, language]);

    const handleNewChat = (sessionTopic = topic, isTemporary = false) => {
        const newId = (isTemporary ? 'temp_' : 'session_') + Date.now().toString() + Math.random().toString(36).substr(2, 5);
        const welcomeMsg = [];

        // Ensure UI clears instantly
        setMessages([]);

        if (!isTemporary) {
            localStorage.setItem(`messages_${newId} `, JSON.stringify(welcomeMsg));
        }

        setSessionList(prev => {
            const newList = [{ id: newId, topic: sessionTopic, preview: isTemporary ? "Temporary Chat" : "", timestamp: Date.now(), isTemporary }, ...prev];
            if (!isTemporary) {
                localStorage.setItem(`sessionList_${language} `, JSON.stringify(newList.filter(s => !s.isTemporary)));
            }
            return newList;
        });
        setCurrentSessionId(newId);
    };

    const handleDeleteChat = (e, idToDelete) => {
        e.stopPropagation(); // prevent clicking the chat

        const normalSessions = sessionList.filter(s => !s.isTemporary);
        if (normalSessions.length <= 1) {
            alert("This is your last remaining chat. It cannot be deleted.");
            return;
        }

        const isConfirmed = window.confirm("Are you sure you want to delete this chat session?");
        if (!isConfirmed) return;

        // Remove from local storage
        localStorage.removeItem(`messages_${idToDelete}`);

        setSessionList(prev => {
            const newList = prev.filter(s => s.id !== idToDelete);
            localStorage.setItem(`sessionList_${language}`, JSON.stringify(newList.filter(s => !s.isTemporary)));

            // If we deleted the currently active chat, switch to another one or create new
            if (currentSessionId === idToDelete) {
                if (newList.length > 0) {
                    setCurrentSessionId(newList[0].id);
                } else {
                    handleNewChat(topic);
                }
            }

            return newList;
        });
    };

    // Multimodal Handlers
    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setAttachments(prev => [...prev, { type, url, name: file.name, file }]);

        // Reset input so the same file could be selected again if removed
        if (e.target) e.target.value = null;
    };

    const extractDocumentText = async (file) => {
        try {
            const ext = file.name.split('.').pop().toLowerCase();
            if (ext === 'txt') {
                return await file.text();
            } else if (ext === 'pdf') {
                const pdfjsLib = await (async () => {
                    if (window.pdfjsLib) return window.pdfjsLib;
                    return new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                        script.onload = () => {
                            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                            resolve(window.pdfjsLib);
                        };
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                })();

                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map(item => item.str);
                    const pageText = strings.join(' ').trim();

                    if (pageText.length < 30) {
                        // Likely a scanned image PDF. Fallback to OCR.
                        console.log(`Page ${i} seems to be an image. Running OCR...`);
                        const viewport = page.getViewport({ scale: 1.5 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        await page.render({ canvasContext: context, viewport }).promise;

                        const Tesseract = (await import('tesseract.js')).default;
                        const { data: { text: ocrText } } = await Tesseract.recognize(canvas, 'eng');
                        fullText += ocrText + '\\n';
                    } else {
                        fullText += pageText + '\\n';
                    }
                }
                return fullText;
            } else if (ext === 'doc' || ext === 'docx') {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
                return result.value;
            } else {
                return "Unsupported document format for text extraction.";
            }
        } catch (error) {
            console.error("Extraction error:", error);
            return "Failed to extract text from document.";
        }
    };

    const removeAttachment = (indexToRemove) => {
        setAttachments(prev => {
            const newAtts = [...prev];
            URL.revokeObjectURL(newAtts[indexToRemove].url); // Clean up memory
            newAtts.splice(indexToRemove, 1);
            return newAtts;
        });
    };

    const handleLiveVoiceStart = () => {
        setIsLiveVoiceMode(true);
        isVoiceModeRef.current = true;
        setAiSpeaking(false);
        isAiSpeakingRef.current = false;
        setLiveSubtitle('Initializing...');

        // Initialize SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Live Voice Mode. Try Chrome or Edge.");
            setIsLiveVoiceMode(false);
            return;
        }

        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : language === 'ta' ? 'ta-IN' : language === 'kn' ? 'kn-IN' : 'en-US';

        rec.onstart = () => {
            if (!isAiSpeakingRef.current) setLiveSubtitle('Listening...');
        };

        rec.onresult = (event) => {
            if (isAiSpeakingRef.current) return; // ignore interrupts for now
            let interimText = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const finalText = event.results[i][0].transcript;
                    setLiveSubtitle(`You: ${finalText} `);
                    processVoiceInput(finalText);
                } else {
                    interimText += event.results[i][0].transcript;
                }
            }
            if (interimText) {
                setLiveSubtitle(`You: ${interimText} `);
            }
        };

        rec.onerror = (e) => {
            // Suppress error in Next.js dev overlay by not using console.error
            // console.log("Speech reco info:", e.error);
            if (e.error !== 'aborted') {
                setLiveSubtitle(`Need microphone permission or retry...`);
                setTimeout(() => {
                    if (isVoiceModeRef.current && !isAiSpeakingRef.current && recognitionRef.current) {
                        try { recognitionRef.current.start(); } catch (err) { }
                    }
                }, 2000);
            }
        };

        rec.onend = () => {
            // Keep listening seamlessly if we are not speaking and not closed
            if (isVoiceModeRef.current && !isAiSpeakingRef.current && recognitionRef.current) {
                try { rec.start(); } catch (err) { }
            }
        };

        recognitionRef.current = rec;
        synthesisRef.current = window.speechSynthesis;
        rec.start();
    };

    const processVoiceInput = async (text) => {
        setAiSpeaking(true);
        isAiSpeakingRef.current = true;
        setLiveSubtitle('Thinking...');

        // Stop listening while AI thinks. We do this *after* setting the true ref 
        // to prevent synchronous onEnd triggers from instantaneously restarting it.
        if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (e) { }
        }

        // Add user msg
        const newUserMessage = { id: Date.now(), text: text, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);

        // Generate response using advanced payload
        try {
            const aiText = await generateAIResponse({ text: text, attachments: [] }, { modelType: 'slm' }); // Now connected to local bridge

            // Clean up the "[SLM Response]: " prefix
            const cleanText = aiText.replace(/\[(?:SLM|LLM) Response\]:\s*/i, '');
            setMessages(prev => [...prev, { id: Date.now() + 1, text: cleanText, sender: 'bot' }]);

            // COMMAND EXECUTION (for Voice)
            const lowerText = text.toLowerCase();
            const commandKeywords = ["open", "search", "screenshot", "system stats", "cpu", "ram", "time", "volume"];
            
            if (commandKeywords.some(keyword => lowerText.includes(keyword))) {
                const { executeSystemCommand } = await import('../services/aiService');
                const result = await executeSystemCommand(text);
                setMessages(prev => [...prev, { id: Date.now() + 2, text: `⚙️ Action: ${result}`, sender: 'bot', isAction: true }]);
            }

            if (!isVoiceModeRef.current) return;
            setLiveSubtitle(`AI: ${cleanText}`);

            // Speak response
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utteranceRef.current = utterance;

            // Map the selected app language to the corresponding TTS language code
            const langMap = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'bn': 'bn-IN',
                'kn': 'kn-IN',
                'ta': 'ta-IN'
            };
            utterance.lang = langMap[language] || 'en-US';

            utterance.onend = () => {
                setAiSpeaking(false);
                isAiSpeakingRef.current = false;
                setLiveSubtitle('Listening...');
                // Resume listening only if still in voice mode
                if (isVoiceModeRef.current && recognitionRef.current) {
                    try { recognitionRef.current.start(); } catch (err) { }
                }
            };

            synthesisRef.current.speak(utterance);

        } catch (error) {
            setLiveSubtitle('Error connecting to AI.');
            setTimeout(() => setAiSpeaking(false), 2000);
        }
    };

    const handleLiveVoiceStop = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setIsLiveVoiceMode(false);
        isVoiceModeRef.current = false;
        setAiSpeaking(false);
        isAiSpeakingRef.current = false;
        setLiveSubtitle('');

        if (recognitionRef.current) {
            recognitionRef.current.onend = null; // Prevent restart loop
            recognitionRef.current.onerror = null;
            try { recognitionRef.current.stop(); } catch (err) { }
            try { recognitionRef.current.abort(); } catch (err) { }
        }
        if (utteranceRef.current) {
            utteranceRef.current.onend = null; // Prevent TTS reviving loop
        }
        if (synthesisRef.current) {
            try { synthesisRef.current.cancel(); } catch (e) { }
        }
    };

    // Clean up voice APIs on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, []);

    const fetchBotResponse = (query) => {
        setTimeout(() => {
            const lowerQuery = query.toLowerCase();

            let foundTopic = null;
            if (topic !== generalEquivalent) {
                foundTopic = allTopics.find(t =>
                    t !== topic && lowerQuery.includes(t.toLowerCase())
                );
                if ((!foundTopic && lowerQuery.includes("unrelated")) || lowerQuery.includes("out of scope")) {
                    foundTopic = generalEquivalent;
                }
            }

            if (foundTopic) {
                setPendingQuestion(query);
                setRedirectTopic(foundTopic);
                setShowPopup(true);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: t.simulatedResponse(topic),
                    sender: 'bot'
                }]);
            }
        }, 1000);
    };

    const handleSend = async (textToSend = input) => {
        if (!textToSend.trim() && attachments.length === 0) return;
        
        setIsThinking(true);

        // Check topic question limits
        const usageKey = `usage_${topic}`;
        let currentUsage = parseInt(localStorage.getItem(usageKey) || '0', 10);

        if (currentUsage >= 100) {
            router.push('/pricing');
            return;
        }

        // Increment limit counter
        localStorage.setItem(usageKey, currentUsage + 1);

        // Extract document texts before sending
        const enrichedAttachments = await Promise.all(attachments.map(async (att) => {
            if (att.type === 'document' && att.file) {
                const extractedText = await extractDocumentText(att.file);
                return { ...att, extractedText };
            }
            return att;
        }));

        // Pass attachments into the user message state structure
        const newUserMessage = {
            id: Date.now(),
            text: textToSend,
            sender: 'user',
            attachments: enrichedAttachments
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setAttachments([]); // clear staging area

        // Trigger AI Response (now linked to local backend)
        try {
            const aiText = await generateAIResponse({ text: textToSend, attachments: enrichedAttachments }, { modelType: 'slm' });
            const cleanText = aiText.replace(/\[(?:SLM|LLM) Response\]:\s*/i, '');

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: cleanText,
                sender: 'bot'
            }]);

            // Push to Django Cloud Backend securely using JWT
            fetchWithAuth('/chat', {
                method: 'POST',
                body: JSON.stringify({
                    message: textToSend,
                    response: cleanText
                })
            }).catch(e => console.error("Cloud Sync Failed", e));

            // COMMAND EXECUTION DETECTION
            const lowerText = textToSend.toLowerCase();
            const commandKeywords = ["open", "search", "screenshot", "system stats", "cpu", "ram", "time", "volume"];
            
            if (commandKeywords.some(keyword => lowerText.includes(keyword))) {
                const { executeSystemCommand } = await import('../services/aiService');
                const result = await executeSystemCommand(textToSend);
                
                // Add a small notification message for the action result
                setMessages(prev => [...prev, {
                    id: Date.now() + 2,
                    text: `⚙️ System Action: ${result}`,
                    sender: 'bot',
                    isAction: true
                }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I'm having trouble connecting to my brain. Is the INDAI Assistant running?",
                sender: 'bot'
            }]);
        } finally {
            setIsThinking(false);
            // Re-focus input after sending
            setTimeout(() => {
                const inputEl = document.getElementById("chat-main-input");
                if (inputEl) inputEl.focus();
            }, 100);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/');
    };

    const handleEditSave = (id) => {
        if (!editInput.trim()) return;

        const msgIndex = messages.findIndex(m => m.id === id);
        if (msgIndex === -1) return;

        // Truncate message history up to this edited message (deletes old responses)
        const updatedMessages = messages.slice(0, msgIndex + 1);
        updatedMessages[msgIndex] = { ...updatedMessages[msgIndex], text: editInput };

        setMessages(updatedMessages);
        setEditingMessageId(null);

        fetchBotResponse(editInput);
    };

    const handleRedirect = () => {
        setShowPopup(false);
        const redirectedMsgs = [
            { id: Date.now(), text: t.redirected(redirectTopic), sender: 'bot' },
            { id: Date.now() + 1, text: pendingQuestion, sender: 'user' },
            { id: Date.now() + 2, text: t.answering(redirectTopic), sender: 'bot' }
        ];

        const newId = 'session_' + Date.now().toString() + Math.random().toString(36).substr(2, 5);
        const combined = [...redirectedMsgs];

        // Find if current was temporary
        const currentSession = sessionList.find(s => s.id === currentSessionId);
        const isTemporary = currentSession ? currentSession.isTemporary : false;

        if (!isTemporary) {
            localStorage.setItem(`messages_${newId} `, JSON.stringify(combined));
        }

        setSessionList(prev => {
            const newList = [{ id: newId, topic: redirectTopic, preview: pendingQuestion.substring(0, 30), timestamp: Date.now(), isTemporary }, ...prev];
            if (!isTemporary) {
                localStorage.setItem(`sessionList_${language} `, JSON.stringify(newList.filter(s => !s.isTemporary)));
            }
            return newList;
        });

        if (onTopicChange) {
            onTopicChange(redirectTopic);
        }
        setCurrentSessionId(newId);
    };

    const visibleSessions = topic === generalEquivalent
        ? sessionList.filter(s => !s.isTemporary)
        : sessionList.filter(s => s.topic === topic && !s.isTemporary);

    const activeSessionState = sessionList.find(s => s.id === currentSessionId);
    const isCurrentTemporary = activeSessionState ? activeSessionState.isTemporary : false;

    return (
        <div className="chatbox-wrapper">
            <BackgroundSlideshow />
            <div className="chatbox-container chatgpt-layout">
                {/* LEFT SIDEBAR */}
                <div className="chatgpt-sidebar">
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="new-chat-btn" onClick={() => handleNewChat(topic, false)} style={{ flex: 1, padding: '10px' }}>
                            <MessageSquarePlus size={20} /> {t.newChat}
                        </button>
                        <button className="new-chat-btn" onClick={() => handleNewChat(topic, true)} title="Temporary Chat (No Save)" style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.1)' }}>
                            <Ghost size={20} />
                        </button>
                    </div>

                    <div className="recent-chats-list">
                        <div className="sidebar-section-title">{t.historyTitle}</div>
                        {visibleSessions.length === 0 && <div className="recent-topic-item">{t.noHistory}</div>}
                        {visibleSessions.map(session => (
                            <div
                                key={session.id}
                                className={`recent - topic - item ${session.id === currentSessionId ? 'active' : ''} `}
                                onClick={() => {
                                    setCurrentSessionId(session.id);
                                    if (topic === generalEquivalent && session.topic !== generalEquivalent && onTopicChange) {
                                        // Optional: if in general, clicking a physics session jumps to physics topic?
                                        // Let's keep topic as "General" but load the chat, or change topic.
                                        // The user said "until general is selected", so if in general, they can see all.
                                        // if they click one, it shouldn't kick them out of general unless we want it to.
                                        // Let's just switch the topic for a better experience context-wise.
                                        onTopicChange(session.topic);
                                    }
                                }}
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                                    {session.isTemporary ? <Ghost size={16} color="#aaa" /> : <MessageSquare size={16} />}
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <span style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>{session.topic}</span>
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.preview || "Chat"}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteChat(e, session.id)}
                                    style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', padding: '5px' }}
                                    title="Delete Chat"
                                >
                                    <Trash2 size={16} className="trash-icon-hover" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN CHAT AREA */}
                <div className="chatgpt-main">
                    <div className="chatbox-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h2>{t.chatbotTitle} {topic}</h2>
                            {isCurrentTemporary && (
                                <span style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Ghost size={12} /> Temporary
                                </span>
                            )}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ position: 'relative' }}>
                                <button 
                                    className="header-btn" 
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    aria-label="User Menu"
                                >
                                    <UserIcon size={20} />
                                </button>
                                {showUserMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '8px',
                                        background: '#202123',
                                        border: '1px solid #444',
                                        borderRadius: '8px',
                                        padding: '4px',
                                        zIndex: 100,
                                        minWidth: '120px'
                                    }}>
                                        <button 
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '8px 12px',
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#ff4a4a',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                fontSize: '14px'
                                            }}
                                            className="trash-icon-hover"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button className="header-btn md-close" onClick={onClose} aria-label="Close Chat"><X size={24} /></button>
                        </div>
                    </div>

                    <div className="chatbox-messages" aria-live="polite">
                        {messages.length === 0 && !isThinking && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: '#888',
                                gap: '16px',
                                textAlign: 'center',
                                padding: '20px'
                            }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '50%' }}>
                                    <MessageSquare size={48} color="#555" />
                                </div>
                                <h3>✨ Your conversation starts here.</h3>
                                <p style={{ fontSize: '14px', maxWidth: '300px' }}>
                                    Ask me anything about your data, or just say hello.
                                </p>
                                <button 
                                    onClick={() => setInput("What can you do?")}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        padding: '8px 16px',
                                        borderRadius: '16px',
                                        color: '#ccc',
                                        cursor: 'pointer',
                                        marginTop: '10px'
                                    }}
                                >
                                    "What can you do?"
                                </button>
                            </div>
                        )}
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.sender} `}>
                                <div className="message-content">
                                    {msg.id === editingMessageId ? (
                                        <div className="message-edit-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                            <textarea
                                                value={editInput}
                                                onChange={(e) => setEditInput(e.target.value)}
                                                autoFocus
                                                style={{ width: '100%', minHeight: '60px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid #444', borderRadius: '8px', padding: '8px', fontFamily: 'inherit', resize: 'vertical' }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => setEditingMessageId(null)} style={{ background: 'transparent', color: '#ccc', border: '1px solid #555', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                                                <button onClick={() => handleEditSave(msg.id)} style={{ background: '#10a37f', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14} /> Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {msg.text && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                                    {msg.sender === 'bot' ? (
                                                        <TypewriterMessage text={msg.text} />
                                                    ) : (
                                                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                                                    )}
                                                    {msg.sender === 'user' && (
                                                        <div style={{ display: 'flex', gap: '8px', opacity: 0.7 }}>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setEditingMessageId(msg.id); setEditInput(msg.text); }}
                                                                style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                                                                title="Edit Message"
                                                                className="trash-icon-hover"
                                                            >
                                                                <Pencil size={12} /> Edit
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(msg.text); }}
                                                                style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                                                                title="Copy Message"
                                                                className="trash-icon-hover"
                                                            >
                                                                <Copy size={12} /> Copy
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <div className="message-attachments">
                                            {msg.attachments.map((att, i) => (
                                                <div key={i} className={`att - item att - ${att.type} `}>
                                                    {att.type === 'image' && <img src={att.url} alt="Uploaded" />}
                                                    {att.type === 'document' && (
                                                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="doc-link">
                                                            <FileText size={16} /> {att.name}
                                                        </a>
                                                    )}
                                                    {att.type === 'audio' && <audio controls src={att.url} />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {isThinking && (
                            <div className="message bot">
                                <div className="message-content">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                                        <div className="thinking-dot" style={{ animationDelay: '0s' }}></div>
                                        <div className="thinking-dot" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="thinking-dot" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbox-input-container">
                        {/* Staged Attachments Preview */}
                        {attachments.length > 0 && (
                            <div className="attachment-preview-area">
                                {attachments.map((att, idx) => (
                                    <div key={idx} className="staged-att">
                                        {att.type === 'image' && <img src={att.url} alt="preview" />}
                                        {att.type === 'document' && <div className="doc-prev"><FileText size={14} /> {att.name}</div>}
                                        {att.type === 'audio' && <audio src={att.url} controls />}
                                        <button onClick={() => removeAttachment(idx)} className="rem-btn"><XCircle size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="chatbox-input">
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={imageInputRef}
                                onChange={(e) => handleFileUpload(e, 'image')}
                            />
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={(e) => handleFileUpload(e, 'document')}
                            />

                            <button className="icon-btn" onClick={() => fileInputRef.current?.click()} title="Attach Document" aria-label="Attach Document"><Paperclip size={20} /></button>
                            <button className="icon-btn" onClick={() => imageInputRef.current?.click()} title="Upload Image" aria-label="Upload Image"><ImageIcon size={20} /></button>
                            <button className="icon-btn live-voice-trigger" onClick={handleLiveVoiceStart} title="Live Voice Chat" aria-label="Live Voice Chat"><Mic size={20} /></button>

                            <input
                                id="chat-main-input"
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isThinking ? "Thinking..." : t.placeholder}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isThinking}
                            />
                            <button onClick={() => handleSend()} className="send-btn" disabled={(!input.trim() && attachments.length === 0) || isThinking} aria-label="Send Message">
                                <Send size={20} />
                            </button>
                            <div className="debug-hint" style={{ fontSize: '10px', color: '#999', position: 'absolute', bottom: '-15px', right: 0 }}>
                                {t.tip}
                            </div>
                        </div>
                    </div>
                </div>

                {/* LIVE VOICE MODE OVERLAY */}
                {isLiveVoiceMode && (
                    <div className="live-voice-overlay slide-up">
                        <div className="voice-header" onClick={handleLiveVoiceStop}>
                            <X size={28} />
                        </div>

                        <div className="voice-visualizer-container">
                            <div className={`pulsing - orb ${aiSpeaking ? 'ai-active' : 'user-active'} `}>
                                <div className="orb-ring ring-1"></div>
                                <div className="orb-ring ring-2"></div>
                                <div className="orb-ring ring-3"></div>
                                <div className="orb-core">
                                    <Mic size={48} color={aiSpeaking ? "#0ea5e9" : "#fff"} />
                                </div>
                            </div>
                        </div>

                        <div className="voice-transcript-wrapper">
                            <h3 className="voice-status">{aiSpeaking ? "AI IS SPEAKING" : "LISTENING"}</h3>
                            <p className="voice-subtitle">{liveSubtitle}</p>
                        </div>

                        <div className="voice-footer">
                            <button className="end-call-btn" onClick={handleLiveVoiceStop}>
                                <PhoneOff size={28} />
                            </button>
                        </div>
                    </div>
                )}

                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <AlertTriangle size={40} color="#FF9933" style={{ marginBottom: '10px' }} />
                            <h3>{t.outOfScopeTitle}</h3>
                            <p>{t.outOfScopeBody1()}<strong>{topic}</strong>.</p>
                            <p>{t.outOfScopeBody2()}<strong>{redirectTopic}</strong>{t.andAskThere}</p>
                            <div className="popup-actions">
                                <button className="cancel-btn" onClick={() => setShowPopup(false)}>{t.cancel}</button>
                                <button className="redirect-btn" onClick={handleRedirect}>
                                    {t.redirect} <ArrowRightCircle size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chatbox;
