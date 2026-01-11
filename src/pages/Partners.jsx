import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Network, Handshake, Users, Zap, Loader } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import './Partners.css';

const iconMap = {
    'GraduationCap': GraduationCap,
    'Network': Network,
    'Building2': Building2,
    'Handshake': Handshake,
    'Zap': Zap,
    'Users': Users
};

const Partners = () => {
    const { i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState({
        hero: { title: 'Партнеры', description: 'Сообщество лидеров...' },
        strategic_header: { title: 'Стратегические партнеры', description: 'Ключевые организации...' },
        ecosystem_header: { title: 'Экосистема Альянса', description: 'Партнеры по направлениям деятельности' },
        benefits_header: { title: 'Преимущества партнерства', description: 'Что получают участники Альянса' },
        cta: { title: 'Станьте частью Альянса', description: 'Мы открыты для новых партнерств...' }
    });

    const [items, setItems] = useState({
        strategic: [],
        categories: [],
        benefits: []
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [
                { data: sData },
                { data: stratData },
                { data: catData },
                { data: benData }
            ] = await Promise.all([
                supabase.from('partners_sections').select('*'),
                supabase.from('partners_strategic').select('*').order('sort_order', { ascending: true }),
                supabase.from('partners_categories').select('*, partners_list(*)').order('sort_order', { ascending: true }),
                supabase.from('partners_benefits').select('*').order('sort_order', { ascending: true })
            ]);

            if (sData) {
                const newSections = { ...sections };
                sData.forEach(s => { if (newSections[s.key]) newSections[s.key] = s; });
                setSections(newSections);
            }

            setItems({
                strategic: stratData || [],
                categories: catData?.map(c => ({
                    ...c,
                    partners: (c.partners_list || []).sort((a, b) => a.sort_order - b.sort_order)
                })) || [],
                benefits: benData || []
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getLocalized = (item, field) => {
        if (!item) return '';
        const lang = i18n.language;
        if (lang === 'ru') return item[field] || '';
        return item[`${field}_${lang}`] || item[field] || '';
    };

    const renderIcon = (name, size = 32) => {
        const Icon = iconMap[name] || Building2;
        return <Icon size={size} />;
    };

    if (loading) return <div className="page-standard"><div className="fixed-loader"><div className="loader-aesthetic"></div></div></div>;

    return (
        <div className="page-standard partners-page">
            {/* Hero Section */}
            <section className="page-hero hero-partners">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                        <h1 className="page-title">{getLocalized(sections.hero, 'title')}</h1>
                        <p className="page-desc">{getLocalized(sections.hero, 'description')}</p>
                    </motion.div>
                </div>
            </section>

            {/* Strategic Partners */}
            <section className="strategic-partners-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{getLocalized(sections.strategic_header, 'title')}</h2>
                        <p className="section-subtitle">{getLocalized(sections.strategic_header, 'description')}</p>
                    </div>
                    <div className="strategic-grid">
                        {items.strategic.map((partner, i) => (
                            <motion.div key={partner.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="strategic-card">
                                <div className="partner-logo">{partner.logo}</div>
                                <div className="partner-content">
                                    <span className="partner-category">{getLocalized(partner, 'category')}</span>
                                    <h3 className="partner-name">{getLocalized(partner, 'name')}</h3>
                                    <h4 className="partner-role">{getLocalized(partner, 'role')}</h4>
                                    <p className="partner-description">{getLocalized(partner, 'description')}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ecosystem Categories */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{getLocalized(sections.ecosystem_header, 'title')}</h2>
                        <p className="section-subtitle">{getLocalized(sections.ecosystem_header, 'description')}</p>
                    </div>
                    <div className="categories-grid">
                        {items.categories.map((cat, i) => (
                            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="category-card">
                                <div className="category-icon">{renderIcon(cat.icon)}</div>
                                <h3 className="category-title">{getLocalized(cat, 'title')}</h3>
                                <div className="partners-list">
                                    {(cat.partners || []).map((p, idx) => (
                                        <div key={p.id} className="partner-item">
                                            <span className="partner-item-name">{getLocalized(p, 'name')}</span>
                                            <span className="partner-item-location">{getLocalized(p, 'location')}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{getLocalized(sections.benefits_header, 'title')}</h2>
                        <p className="section-subtitle">{getLocalized(sections.benefits_header, 'description')}</p>
                    </div>
                    <div className="benefits-grid">
                        {items.benefits.map((benefit, i) => (
                            <motion.div key={benefit.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="benefit-card">
                                <div className="benefit-icon">{renderIcon(benefit.icon, 40)}</div>
                                <h3 className="benefit-title">{getLocalized(benefit, 'title')}</h3>
                                <p className="benefit-description">{getLocalized(benefit, 'description')}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div className="cta-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="cta-title">{getLocalized(sections.cta, 'title')}</h2>
                        <p className="cta-description">{getLocalized(sections.cta, 'description')}</p>
                        <button className="primary-btn">Подать заявку на вступление</button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Partners;
