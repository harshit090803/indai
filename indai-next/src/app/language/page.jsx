"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundSlideshow from '../../components/BackgroundSlideshow';
import { Brain } from 'lucide-react';
import './LanguageSelection.css';
import '../logo-anim.css';

const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'bn', name: 'Bengali (বাংলা)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
];

const ALL_LANGUAGES = [
    { code: "hi", text: "Hindi (हिन्दी)" },
    { code: "en", text: "English" },
    { code: "bn", text: "Bengali (বাংলা)" },
    { code: "kn", text: "Kannada (ಕನ್ನಡ)" },
    { code: "ta", text: "Tamil (தமிழ்)" },
    { code: "te", text: "Telugu (తెలుగు)" },
    { code: "mr", text: "Marathi (मराठी)" },
    { code: "gu", text: "Gujarati (ગુજરાતી)" },
    { code: "ur", text: "Urdu (اردو)" },
    { code: "pa", text: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "ml", text: "Malayalam (മലയാളം)" },
    { code: "or", text: "Odia (ଓଡ଼ିଆ)" }
];

const LanguageSelection = () => {
    const router = useRouter();
    const navigate = (path) => router.push(path);
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const handleContinue = () => {
        if (!selectedLanguage) {
            alert('Please select a language');
            return;
        }

        const isSupported = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage);
        if (isSupported) {
            localStorage.setItem('selectedLanguage', selectedLanguage);
            navigate('/topics');
        } else {
            alert(`Language selected: ${selectedLanguage}. Support coming soon!`);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
            <BackgroundSlideshow />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1 }}></div>

            <div className="language-container animate-fade-in">
                <div className="logo" style={{ marginBottom: '40px' }}>
                    <div className="tricolor-background" style={{ top: '-10px', width: '80px', height: '80px' }}></div>
                    <div className="logo-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="logo-icon" style={{ color: 'var(--primary-color)', filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))', marginBottom: '16px' }}>
                            <Brain size={48} strokeWidth={1.5} />
                        </div>
                        <div className="logo-text" style={{ fontSize: '28px', color: 'white', fontWeight: 800 }}>IND<span className="logo-text-animated-wrapper">
                            <div className="logo-text-flipper">
                                <span className="logo-text-ai">AI</span>
                                <span className="logo-text-ia">IA</span>
                            </div>
                        </span></div>
                        <div className="tagline" style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Select Your Preferred Language</div>
                    </div>
                </div>

                <div className="language-selection">
                    <label htmlFor="language">Choose Language</label>
                    <select
                        id="language"
                        className="language-dropdown glass-input"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                        <option value="" disabled>-- Select Language --</option>
                        {ALL_LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.text}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="btn-primary submit-btn" style={{ width: '100%' }} onClick={handleContinue}>
                    Continue Selection
                </button>
            </div>
        </div>
    );
};

export default LanguageSelection;
