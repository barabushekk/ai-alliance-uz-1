import React from 'react';

const AdminPageHeader = ({ title, subtitle, activeLang, setActiveLang }) => {
    const languages = [
        { code: 'ru', label: 'RU', flag: '🇷🇺' },
        { code: 'uz', label: 'UZ', flag: '🇺🇿' },
        { code: 'en', label: 'EN', flag: '🇬🇧' }
    ];

    return (
        <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            padding: '32px 40px',
            borderRadius: '20px',
            marginBottom: '32px',
            boxShadow: '0 15px 35px -5px rgba(99, 102, 241, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorations */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '300px',
                height: '300px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                left: '10%',
                width: '150px',
                height: '150px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: '800',
                    marginBottom: '8px',
                    letterSpacing: '-0.025em',
                    marginTop: 0
                }}>
                    {title}
                </h2>
                <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '15px',
                    fontWeight: '500',
                    margin: 0
                }}>
                    {subtitle}
                </p>
            </div>

            <div style={{
                display: 'flex',
                gap: '8px',
                background: 'rgba(255,255,255,0.15)',
                padding: '6px',
                borderRadius: '16px',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                position: 'relative',
                zIndex: 1
            }}>
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setActiveLang(lang.code)}
                        type="button"
                        style={{
                            padding: '8px 16px',
                            background: activeLang === lang.code ? 'white' : 'transparent',
                            color: activeLang === lang.code ? '#6366f1' : 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '700',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: activeLang === lang.code ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <span style={{ fontSize: '14px', opacity: activeLang === lang.code ? 1 : 0.8 }}>
                            {lang.flag}
                        </span>
                        {lang.code.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminPageHeader;
