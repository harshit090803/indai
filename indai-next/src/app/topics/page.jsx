"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundSlideshow from '../../components/BackgroundSlideshow';
import { Brain, Search, ChevronLeft, ChevronRight, MessageSquareX } from 'lucide-react';
import Chatbox from '../../components/Chatbox';
import './Topics.css';

// Simulated topics dictionaries for different languages
const TopicsDict = {
    en: [
        "General", "Acoustics", "Advertising", "Aerodynamics", "Agriculture",
        "Anatomy", "Animation", "Architecture", "Astrophysics", "Biology",
        "Business Law", "Calculus", "Chemistry", "Civil Engineering",
        "Cloud Computing", "Computer Science", "Data Science", "Ecology",
        "Economics", "Education", "Electrical Engineering", "Finance",
        "Genetics", "Geography", "History", "Information Technology",
        "Journalism", "Linguistics", "Machine Learning", "Marketing",
        "Mathematics", "Medicine", "Meteorology", "Music", "Nursing",
        "Operations Management", "Pharmacology", "Philosophy", "Physics",
        "Political Science", "Psychology", "Quantum Mechanics", "Robotics",
        "Sociology", "Software Engineering", "Statistics", "Theology",
        "Zoology"
    ],
    hi: [
        "सामान्य", "अकूस्टिक्स", "विज्ञापन", "वायुगतिकी", "कृषि",
        "एनाटॉमी", "एनिमेशन", "वास्तुकला", "खगोल भौतिकी", "जीव विज्ञान",
        "व्यावसायिक कानून", "कैलकुलस", "रसायन विज्ञान", "सिविल इंजीनियरिंग",
        "क्लाउड कंप्यूटिंग", "कंप्यूटर विज्ञान", "डेटा विज्ञान", "पारिस्थितिकी",
        "अर्थशास्त्र", "शिक्षा", "इलेक्ट्रिकल इंजीनियरिंग", "वित्त",
        "आनुवंशिकी", "भूगोल", "इतिहास", "सूचना प्रौद्योगिकी",
        "पत्रकारिता", "भाषाविज्ञान", "मशीन लर्निंग", "विपणन",
        "गणित", "चिकित्सा", "मौसम विज्ञान", "संगीत", "नर्सिंग",
        "संचालन प्रबंधन", "फार्माकोलॉजी", "दर्शनशास्त्र", "भौतिकी",
        "राजनीति विज्ञान", "मनोविज्ञान", "क्वांटम यांत्रिकी", "रोबोटिक्स",
        "समाजशास्त्र", "सॉफ्टवेयर इंजीनियरिंग", "सांख्यिकी", "धर्मशास्त्र",
        "प्राणी विज्ञान"
    ],
    bn: [
        "সাধারণ", "শব্দবিজ্ঞান", "বিজ্ঞাপন", "বায়ুগতিবিদ্যা", "কৃষি",
        "অ্যানাটমি", "অ্যানিমেশন", "স্থাপত্য", "অ্যাস্ট্রোফিজিক্স", "জীববিদ্যা",
        "ব্যবসা আইন", "ক্যালকুলাস", "রসায়ন", "পুরকৌশল",
        "ক্লাউড কম্পিউটিং", "কম্পিউটার বিজ্ঞান", "ডেটা সায়েন্স", "বাস্তুসংস্থান",
        "অর্থনীতি", "শিক্ষা", "তড়িৎ প্রকৌশল", "অর্থায়ন",
        "জেনেটিক্স", "ভূগোল", "ইতিহাস", "তথ্য প্রযুক্তি",
        "সাংবাদিকতা", "ভাষাবিজ্ঞান", "মেশিন লার্নিং", "বিপণন",
        "গণিত", "চিকিৎসা", "আবহাওয়া বিজ্ঞান", "সঙ্গীত", "নার্সিং",
        "অপারেশন ম্যানেজমেন্ট", "ফার্মাকোলজি", "দর্শন", "পদার্থবিদ্যা",
        "রাষ্ট্রবিজ্ঞান", "মনোবিজ্ঞান", "কোয়ান্টাম মেকানিক্স", "রোবোটিক্স",
        "সমাজবিজ্ঞান", "সফটওয়্যার ইঞ্জিনিয়ারিং", "পরিসংখ্যান", "ধর্মতত্ত্ব",
        "প্রাণিবিদ্যা"
    ],
    kn: [
        "ಸಾಮಾನ್ಯ", "ಧ್ವನಿವಿಜ್ಞಾನ", "ಜಾಹೀರಾತು", "ವಾಯುಬಲವಿಜ್ಞಾನ", "ಕೃಷಿ",
        "ಅಂಗರಚನಾಶಾಸ್ತ್ರ", "ಅನಿಮೇಷನ್", "ವಾಸ್ತುಶಿಲ್ಪ", "ಖಗೋಳ ಭೌತಶಾಸ್ತ್ರ", "ಜೀವಶಾಸ್ತ್ರ",
        "ವ್ಯಾಪಾರ ಕಾನೂನು", "ಕ್ಯಾಲ್ಕುಲಸ್", "ರಸಾಯನಶಾಸ್ತ್ರ", "ಸಿವಿಲ್ ಎಂಜಿನಿಯರಿಂಗ್",
        "ಕ್ಲೌಡ್ ಕಂಪ್ಯೂಟಿಂಗ್", "ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ", "ಡೇಟಾ ಸೈನ್ಸ್", "ಪರಿಸರ ವಿಜ್ಞಾನ",
        "ಅರ್ಥಶಾಸ್ತ್ರ", "ಶಿಕ್ಷಣ", "ಎಲೆಕ್ಟ್ರಿಕಲ್ ಎಂಜಿನಿಯರಿಂಗ್", "ಹಣಕಾಸು",
        "ತಳಿಶಾಸ್ತ್ರ", "ಭೂಗೋಳ", "ಇತಿಹಾಸ", "ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ",
        "ಪತ್ರಿಕೋದ್ಯಮ", "ಭಾಷಾಶಾಸ್ತ್ರ", "ಯಂತ್ರ ಕಲಿಕೆ", "ಮಾರುಕಟ್ಟೆ",
        "ಗಣಿತ", "ಔಷಧ", "ಹವಾಮಾನಶಾಸ್ತ್ರ", "ಸಂಗೀತ", "ಶುಶ್ರೂಷೆ",
        "ಕಾರ್ಯಾಚರಣೆ ನಿರ್ವಹಣೆ", "ಔಷಧಶಾಸ್ತ್ರ", "ತತ್ವಶಾಸ್ತ್ರ", "ಭೌತಶಾಸ್ತ್ರ",
        "ರಾಜ್ಯಶಾಸ್ತ್ರ", "ಮನೋವಿಜ್ಞಾನ", "ಕ್ವಾಂಟಮ್ ಮೆಕ್ಯಾನಿಕ್ಸ್", "ರೊಬೊಟಿಕ್ಸ್",
        "ಸಮಾಜಶಾಸ್ತ್ರ", "ಸಾಫ್ಟ್‌ವೇರ್ ಎಂಜಿನಿಯರಿಂಗ್", "ಸಂಖ್ಯಾಗಣಿತ", "ಧರ್ಮಶಾಸ್ತ್ರ",
        "ಪ್ರಾಣಿಶಾಸ್ತ್ರ"
    ],
    ta: [
        "பொது", "ஒலியியல்", "விளம்பரம்", "காற்றியக்கவியல்", "வேளாண்மை",
        "உடற்கூறியல்", "இயங்குபடம்", "கட்டிடக்கலை", "வானியற்பியல்", "உயிரியல்",
        "வணிக சட்டம்", "கலனக்கணிதம்", "வேதியியல்", "சிவில் இன்ஜினியரிங்",
        "கிளவுட் கம்ப்யூட்டிங்", "கணினி அறிவியல்", "தரவு அறிவியல்", "சூழலியல்",
        "பொருளாதாரம்", "கல்வி", "மின் பொறியியல்", "நிதி",
        "மரபியல்", "புவியியல்", "வரலாறு", "தகவல் தொழில்நுட்பம்",
        "இதழியல்", "மொழியியல்", "இயந்திர கற்றல்", "சந்தைப்படுத்தல்",
        "கணிதம்", "மருத்துவம்", "வானிலை ஆய்வு", "இசை", "செவிலியர்",
        "செயல்பாட்டு மேலாண்மை", "பார்மகாலஜி", "தத்துவம்", "இயற்பியல்",
        "அரசியல் அறிவியல்", "உளவியல்", "குவாண்டம் மெக்கானிக்ஸ்", "ரோபாட்டிக்ஸ்",
        "சமூகவியல்", "மென்பொருள் பொறியியல்", "புள்ளியியல்", "இறையியல்",
        "விலங்கியல்"
    ]
};

const defaultTitle = {
    en: "Choose your desired topic",
    hi: "अपना विषय चुनें",
    bn: "আপনার কাঙ্ক্ষিত বিষয় চয়ন করুন",
    kn: "ನಿಮ್ಮ ಅಪೇಕ್ಷಿತ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    ta: "நீங்கள் விரும்பிய தலைப்பை தேர்ந்தெடுக்கவும்",
}

const defaultPlaceHolder = {
    en: "Search topics...",
    hi: "विषय खोजें...",
    bn: "বিষয়গুলি অনুসন্ধান করুন...",
    kn: "ವಿಷಯಗಳನ್ನು ಹುಡುಕಿ...",
    ta: "தலைப்புகளை தேடுங்கள்...",
}

const Topics = () => {
    const router = useRouter();
    const navigate = (path) => router.push(path);
    const [lang, setLang] = useState('en');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const topicsPerPage = 20;

    useEffect(() => {
        const storedLang = localStorage.getItem('selectedLanguage');
        if (storedLang && TopicsDict[storedLang]) {
            setLang(storedLang);
        } else if (storedLang) {
            // fallback if language is unsupported in our mock list
            setLang('en');
        }
    }, []);

    const allTopics = useMemo(() => {
        let list = TopicsDict[lang] || TopicsDict['en'];
        // Ensure the "general" equivalent is always first
        const generalTranslation = TopicsDict[lang] ? TopicsDict[lang][0] : TopicsDict['en'][0];

        let filtered = list.filter(t => t.toLowerCase().includes(search.toLowerCase()));

        // Ensure "General" is always at the top if it matches the search (or if search is empty)
        if (filtered.includes(generalTranslation)) {
            filtered = [generalTranslation, ...filtered.filter(t => t !== generalTranslation)];
        }

        return filtered;
    }, [lang, search]);

    const totalPages = Math.ceil(allTopics.length / topicsPerPage);
    const currentTopics = allTopics.slice((page - 1) * topicsPerPage, page * topicsPerPage);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    if (selectedTopic) {
        return (
            <Chatbox
                topic={selectedTopic}
                language={lang}
                onClose={() => setSelectedTopic(null)}
                onTopicChange={(t) => setSelectedTopic(t)}
                allTopics={TopicsDict[lang] || TopicsDict['en']}
            />
        );
    }

    return (
        <>
            <BackgroundSlideshow />
            <div className="topics-container-page">
                <div className="header">
                    <h1>{defaultTitle[lang] || defaultTitle['en']}</h1>
                    <div className="search-bar">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder={defaultPlaceHolder[lang] || defaultPlaceHolder['en']}
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="topics-grid">
                    {currentTopics.map((topic, i) => (
                        <div
                            key={i}
                            className={`topic-card ${i === 0 && page === 1 && search === '' ? 'general' : ''}`}
                            onClick={() => setSelectedTopic(topic)}
                        >
                            {topic}
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                            <ChevronLeft size={16} />
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Topics;
