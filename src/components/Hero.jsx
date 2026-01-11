import React, { useEffect, useState } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import './Hero.css';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { i18n } = useTranslation();
    const [hero, setHero] = useState({
        title: 'Альянс в сфере искусственного интеллекта',
        description: 'Мы объединяем технологические компании для развития рынка ИИ, совершенствования законодательной базы и подготовки кадров.',
        card_label: 'Документ',
        card_title: 'Национальная стратегия развития ИИ до 2030 года',
        card_text: 'Ключевые показатели и дорожная карта внедрения технологий в экономику.',
        card_link: '',
        footer_title: 'Исследование 2025:',
        footer_desc: 'Тренды генеративных моделей в Центральной Азии',
        footer_link: ''
    });

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        try {
            const { data, error } = await supabase.from('hero_section').select('*').single();
            if (data) setHero(data);
            if (error) console.error('Error fetching hero data:', error);
        } catch (err) {
            console.error('Hero fetch error:', err);
        }
    };

    const getLocalized = (field) => {
        const lang = i18n.language;
        if (lang === 'ru') return hero[field] || '';
        const localizedValue = hero[`${field}_${lang}`];
        return localizedValue || hero[field] || '';
    };

    const handleAction = (manualUrl) => {
        const targetUrl = hero.document_url || manualUrl;
        if (!targetUrl) return;

        if (targetUrl.startsWith('http')) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } else {
            window.location.href = targetUrl;
        }
    };

    return (
        <section className="hero">
            {hero.background_url ? (
                hero.background_type === 'image' ? (
                    <div
                        className="hero-video"
                        style={{
                            backgroundImage: `url(${hero.background_url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                ) : (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="hero-video"
                        key={hero.background_url}
                    >
                        <source src={hero.background_url} type="video/mp4" />
                    </video>
                )
            ) : (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="hero-video"
                >
                    <source src="/hero-background.mp4" type="video/mp4" />
                </video>
            )}
            <div className="container">
                <div className="hero-row">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-left"
                    >
                        <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>
                            {getLocalized('title')}
                        </h1>
                        <p className="hero-desc">
                            {getLocalized('description')}
                        </p>
                    </motion.div>

                    {/* Right Column - Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="hero-right"
                    >
                        <motion.div
                            className="hero-card"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => (hero.document_url || hero.card_link) && handleAction(getLocalized('card_link'))}
                            style={{ cursor: (hero.document_url || hero.card_link) ? 'pointer' : 'default' }}
                        >
                            <div>
                                <div className="card-label">{getLocalized('card_label')}</div>
                                <h3 className="card-title">
                                    {getLocalized('card_title')}
                                </h3>
                                <p className="card-text">
                                    {getLocalized('card_text')}
                                </p>
                            </div>
                            <button className="btn-download" onClick={(e) => {
                                e.stopPropagation();
                                handleAction(getLocalized('card_link'));
                            }}>
                                <Download size={14} /> Скачать PDF
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hero-footer"
                    onClick={() => hero.footer_link && handleAction(getLocalized('footer_link'))}
                    style={{ cursor: hero.footer_link ? 'pointer' : 'default' }}
                >
                    <div className="footer-content">
                        <span className="footer-title">{getLocalized('footer_title')}</span>
                        <span className="footer-desc">{getLocalized('footer_desc')}</span>
                    </div>
                    <button className="btn-arrow" onClick={(e) => {
                        e.stopPropagation();
                        handleAction(getLocalized('footer_link'));
                    }}>
                        <ArrowRight size={16} />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
