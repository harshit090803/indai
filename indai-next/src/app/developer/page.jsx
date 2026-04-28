"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Code2, Key, Activity, Plus, ChevronRight, 
    Copy, Trash2, Zap, Shield, Info, ArrowLeft 
} from 'lucide-react';
import '../legal.css'; 

export default function DeveloperDashboard() {
    const router = useRouter();
    const [apis, setApis] = useState([]);
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [usage, setUsage] = useState({ current: 0, limit: 10 });
    
    // Form State
    const [newApi, setNewApi] = useState({ name: '', description: '', parameters: '' });
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock User ID for demonstration (In production, get from session)
    const MOCK_USER_ID = "65f1a2b3c4d5e6f7a8b9c0d1"; 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Keys
            const kRes = await fetch('/api/developer/keys', {
                headers: { 'x-user-id': MOCK_USER_ID }
            });
            const kData = await kRes.json();
            setKeys(kData.keys || []);

            // Mocking API list and usage for now
            // In a real app, we'd have an endpoint for this
            setApis([
                { apiId: 'abc123', name: 'Sentiment Pro', description: 'Detailed sentiment analysis API', usageCount: 2 },
            ]);
            setUsage({ current: 3, limit: 10 });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateApi = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/developer/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: MOCK_USER_ID,
                    name: newApi.name,
                    description: newApi.description,
                    parameters: newApi.parameters.split(',').map(p => p.trim()).filter(p => p)
                })
            });
            const data = await res.json();
            if (data.success) {
                setShowCreateModal(false);
                setNewApi({ name: '', description: '', parameters: '' });
                fetchData(); // Refresh
            }
        } catch (e) {
            alert('Generation failed. Please check backend connection.');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateKey = async () => {
        const label = prompt("Enter a label for this API key:");
        if (!label) return;

        const res = await fetch('/api/developer/keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: MOCK_USER_ID, label })
        });
        const data = await res.json();
        if (data.success) fetchData();
    };

    return (
        <div className="legal-container" style={{ minHeight: '100vh', padding: '100px 20px 40px', fontFamily: '"Inter", sans-serif', color: '#fff' }}>
            <button
                onClick={() => router.push('/')}
                style={{
                    position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)', zIndex: 10
                }}
            >
                <ArrowLeft size={18} /> Exit Portal
            </button>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Developer Portal
                    </h1>
                    <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Manage your INDAI-powered APIs and integration keys.</p>
                </header>

                {/* Status Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <span style={{ color: '#aaa', fontWeight: '600' }}>TOTAL USAGE</span>
                            <Activity size={20} color="#3b82f6" />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '800' }}>{usage.current}<span style={{ fontSize: '1rem', color: '#666' }}> / {usage.limit} requests</span></div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '15px', overflow: 'hidden' }}>
                            <div style={{ width: `${(usage.current / usage.limit) * 100}%`, height: '100%', background: '#3b82f6' }}></div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    {/* APIs Section */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Your Generated APIs</h2>
                            <button onClick={() => setShowCreateModal(true)} style={primaryBtnStyle}><Plus size={18} /> New API</button>
                        </div>

                        {apis.length === 0 ? (
                            <div style={emptyStateStyle}>No APIs generated yet. Create one with the wizard!</div>
                        ) : (
                            apis.map(api => (
                                <div key={api.apiId} style={apiCardStyle}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{api.name}</h3>
                                        <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>ID: <code>{api.apiId}</code> • {api.usageCount} calls</p>
                                    </div>
                                    <ChevronRight size={20} color="#666" />
                                </div>
                            ))
                        )}
                    </section>

                    {/* Keys Section */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Access Keys</h2>
                            <button onClick={generateKey} style={ghostBtnStyle}><Key size={16} /> Generate</button>
                        </div>
                        <div style={cardStyle}>
                            {keys.map((k, i) => (
                                <div key={i} style={{ padding: '10px 0', borderBottom: i === keys.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontWeight: 'bold' }}>{k.label}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                                        <code style={{ fontSize: '0.8rem', color: '#3b82f6' }}>{k.key.substring(0, 10)}...</code>
                                        <Copy size={14} style={{ cursor: 'pointer', color: '#666' }} onClick={() => {
                                            navigator.clipboard.writeText(k.key);
                                            alert('Key copied to clipboard!');
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Modal */}
            {showCreateModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2>Generate New API</h2>
                        <input 
                            placeholder="API Name (e.g. Code Reviewer)" 
                            style={inputStyle}
                            value={newApi.name}
                            onChange={(e) => setNewApi({...newApi, name: e.target.value})}
                        />
                        <textarea 
                            placeholder="What should this API do? (e.g. Take a code snippet and suggest optimizations)" 
                            style={{...inputStyle, height: '100px', resize: 'none'}}
                            value={newApi.description}
                            onChange={(e) => setNewApi({...newApi, description: e.target.value})}
                        />
                        <input 
                            placeholder="Parameters (comma separated, e.g. language, code)" 
                            style={inputStyle}
                            value={newApi.parameters}
                            onChange={(e) => setNewApi({...newApi, parameters: e.target.value})}
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button 
                                onClick={handleCreateApi} 
                                disabled={isGenerating}
                                style={{...primaryBtnStyle, flex: 1, padding: '15px'}}
                            >
                                {isGenerating ? 'AI is Brainstorming...' : 'Generate API with AI'}
                            </button>
                            <button onClick={() => setShowCreateModal(false)} style={ghostBtnStyle}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const cardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '24px'
};

const apiCardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const primaryBtnStyle = {
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const ghostBtnStyle = {
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '10px 20px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    marginBottom: '10px'
};

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContentStyle = {
    background: '#111', padding: '30px', borderRadius: '24px',
    width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)'
};

const emptyStateStyle = {
    padding: '40px', textAlign: 'center', color: '#666', 
    border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '20px'
};
