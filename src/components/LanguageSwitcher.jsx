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

    const currentLang = languages.find(l =>
        i18n.language === l.code ||
        i18n.language?.startsWith(l.code + '-') ||
        i18n.resolvedLanguage === l.code
    ) || languages[0];

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

    return (
        <div className="language-switcher" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lang-btn ${isDark ? 'dark' : 'light'}`}
                title={currentLang.label}
            >
                <span className="lang-code">{currentLang.label}</span>
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
                            <span className="lang-label">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
