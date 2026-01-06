import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ isDark = false }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const languages = [
        { code: 'ru', label: 'RU' },
        { code: 'uz', label: "UZ" },
        { code: 'en', label: 'EN' }
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    // SVG Flag components
    const FlagRU = () => (
        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="15" fill="white" />
            <rect top="5" width="20" height="5" transform="translate(0 5)" fill="#0039A6" />
            <rect top="10" width="20" height="5" transform="translate(0 10)" fill="#D52B1E" />
            <rect width="20" height="15" stroke="rgba(0,0,0,0.1)" strokeWidth="1" rx="2" style={{ fill: 'none' }} />
        </svg>
    );

    const FlagUZ = () => (
        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="5" fill="#0099B5" />
            <rect y="5" width="20" height="0.5" fill="#CE1126" />
            <rect y="5.5" width="20" height="4" fill="white" />
            <rect y="9.5" width="20" height="0.5" fill="#CE1126" />
            <rect y="10" width="20" height="5" fill="#1EB53A" />
            <circle cx="3" cy="2.5" r="1" fill="white" />
            <path d="M5.5 2.5 L6 2.5 L6 2 L6.5 2.5 L6 3 L5.5 3 Z" fill="white" transform="scale(0.3) translate(15, 5)" />
            <rect width="20" height="15" stroke="rgba(0,0,0,0.1)" strokeWidth="1" rx="2" style={{ fill: 'none' }} />
        </svg>
    );

    const FlagEN = () => (
        <svg width="20" height="15" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
            <clipPath id="s">
                <path d="M0,0 v30 h60 v-30 z" />
            </clipPath>
            <clipPath id="t">
                <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
            </clipPath>
            <g clipPath="url(#s)">
                <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </g>
            <rect width="60" height="30" stroke="rgba(0,0,0,0.1)" strokeWidth="2" rx="0" style={{ fill: 'none' }} />
        </svg>
    );

    const getFlag = (code) => {
        switch (code) {
            case 'ru': return <FlagRU />;
            case 'uz': return <FlagUZ />;
            case 'en': return <FlagEN />;
            default: return <FlagRU />;
        }
    };

    return (
        <div className="language-switcher" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lang-btn ${isDark ? 'dark' : 'light'}`}
                title={currentLang.label}
            >
                <span className="lang-flag">{getFlag(currentLang.code)}</span>
                <ChevronDown size={14} className={`chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {isOpen && (
                <div className="lang-dropdown">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                        >
                            <span className="lang-flag">{getFlag(lang.code)}</span>
                            <span className="lang-label">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
