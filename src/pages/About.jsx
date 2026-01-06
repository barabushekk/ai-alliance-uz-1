import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Shield, Award, Users, Zap, FileText, Globe } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import './About.css';

// Icon mapping for dynamic rendering
const iconMap = {
    'Target': Target,
    'Eye': Eye,
    'Shield': Shield,
    'Award': Award,
    'Users': Users,
    'Zap': Zap,
    'FileText': FileText,
    'Globe': Globe
};

const About = () => {
    const { t, i18n } = useTranslation();
    const [sections, setSections] = useState({
        hero: { title: 'Об Альянсе', description: 'Загрузка...' },
        mission: { title: 'Наша Миссия', description: '...', icon: 'Target' },
        vision: { title: 'Наше Видение', description: '...', icon: 'Eye' }
    });
    const [stats, setStats] = useState([]);
    const [values, setValues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Sections
            const { data: sectionsData } = await supabase.from('about_sections').select('*');
            if (sectionsData) {
                const newSections = { ...sections };
                sectionsData.forEach(item => {
                    // Store the raw item to access all localized fields
                    newSections[item.key] = item;
                });
                setSections(newSections);
            }

            // 2. Fetch Stats
            const { data: statsData } = await supabase.from('about_stats').select('*').order('sort_order');
            if (statsData) setStats(statsData);

            // 3. Fetch Values
            const { data: valuesData } = await supabase.from('about_values').select('*').order('sort_order');
            if (valuesData) setValues(valuesData);

        } catch (error) {
            console.error('Error fetching about data:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderIcon = (iconName, size = 24) => {
        const IconComponent = iconMap[iconName] || Zap;
        return <IconComponent size={size} />;
    };

    // Helper to get localized content
    const getLocalized = (item, field) => {
        if (!item) return '';
        const lang = i18n.language;
        // Default to 'ru' (base field name) if lang is 'ru' or fallback
        if (lang === 'ru') return item[field] || '';

        // Try to get specific language field
        const localizedValue = item[`${field}_${lang}`];

        // Return localized value if exists, otherwise fallback to base field (RU)
        return localizedValue || item[field] || '';
    };

    if (loading) {
        return (
            <div className="page-standard about-page">
                {/* Full Screen Premium Loader */}
                <div className="loading-container fixed-loader">
                    <div className="loader-aesthetic"></div>
                </div>
            </div>
        );
    }

    const heroTitle = getLocalized(sections.hero, 'title');

    return (
        <div className="page-standard about-page">
            {/* Hero Section */}
            <section className="page-hero hero-about">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="page-header"
                    >
                        <h1 className="page-title">
                            {/* Special styling for specific phrases if needed, otherwise just text */}
                            <span className="gradient-text">{heroTitle}</span>
                        </h1>
                        <p className="page-desc">{getLocalized(sections.hero, 'description')}</p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section - Symmetrical Grid */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="stat-card"
                            >
                                <h3 className="stat-value">{stat.value}</h3>
                                <p className="stat-label">{getLocalized(stat, 'label')}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision - Split Symmetrical Section */}
            <section className="mission-vision-section">
                <div className="container">
                    <div className="split-layout">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="split-card mission-card"
                        >
                            <div className="card-icon-wrapper">
                                {renderIcon(sections.mission.icon, 40)}
                            </div>
                            <h2 className="split-title">{getLocalized(sections.mission, 'title')}</h2>
                            <p className="split-text">{getLocalized(sections.mission, 'description')}</p>
                        </motion.div>

                        {/* Divider Line (Desktop only) */}
                        <div className="split-divider"></div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="split-card vision-card"
                        >
                            <div className="card-icon-wrapper">
                                {renderIcon(sections.vision.icon, 40)}
                            </div>
                            <h2 className="split-title">{getLocalized(sections.vision, 'title')}</h2>
                            <p className="split-text">{getLocalized(sections.vision, 'description')}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section - Symmetrical Grid */}
            <section className="values-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{t('about_page.values_title')}</h2>
                        <p className="section-subtitle">{t('about_page.values_subtitle')}</p>
                    </div>

                    <div className="values-grid">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="value-card"
                            >
                                <div className="value-icon">{renderIcon(v.icon, 32)}</div>
                                <h3 className="value-title">{getLocalized(v, 'title')}</h3>
                                <p className="value-desc">{getLocalized(v, 'description')}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
