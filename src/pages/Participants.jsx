import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Globe, Users, Building2, GraduationCap, Loader, BookOpen, Shield } from 'lucide-react';
import WaveDecor from '../components/WaveDecor';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import ApplicationModal from '../components/ApplicationModal';
import './Participants.css';

// Icon mapping
const iconMap = {
    'CheckCircle': CheckCircle,
    'Zap': Zap,
    'Globe': Globe,
    'Users': Users,
    'Building2': Building2,
    'GraduationCap': GraduationCap,
    'Shield': Shield,
    'BookOpen': BookOpen
};

const Participants = () => {
    const { i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState({
        hero: { title: 'Стать Участником', description: 'Присоединяйтесь к экосистеме лидеров...' },
        benefits_header: { title: 'Преимущества членства', description: '' },
        types_header: { title: 'Типы участия', description: 'Выберите подходящий формат взаимодействия с Альянсом' },
        req_header: { title: 'Условия и требования', description: '' },
        steps_header: { title: 'Как вступить в Альянс?', description: '' }
    });
    const [items, setItems] = useState({
        benefits: [],
        types: [],
        requirements: [],
        steps: []
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [
                { data: sData },
                { data: bData },
                { data: tData },
                { data: rData },
                { data: stData }
            ] = await Promise.all([
                supabase.from('participants_sections').select('*'),
                supabase.from('participants_benefits').select('*').order('sort_order', { ascending: true }),
                supabase.from('participants_types').select('*').order('sort_order', { ascending: true }),
                supabase.from('participants_requirements').select('*').order('sort_order', { ascending: true }),
                supabase.from('participants_steps').select('*').order('sort_order', { ascending: true })
            ]);

            if (sData) {
                const newSections = { ...sections };
                sData.forEach(s => newSections[s.key] = s);
                setSections(newSections);
            }

            setItems({
                benefits: bData || [],
                types: tData || [],
                requirements: rData || [],
                steps: stData || []
            });

        } catch (error) {
            console.error('Error fetching participants data:', error);
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

    const renderIcon = (iconName, size = 32) => {
        const Icon = iconMap[iconName] || CheckCircle;
        return <Icon size={size} />;
    };

    const parseList = (listStr) => {
        if (!listStr) return [];
        return listStr.split('\n').filter(line => line.trim() !== '');
    };

    if (loading) {
        return (
            <div className="page-standard">
                <div className="loading-container fixed-loader">
                    <div className="loader-aesthetic"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-standard participants-page">
            {/* Hero Section */}
            <section className="page-hero hero-participants">
                <WaveDecor side="left" opacity={0.4} />
                <WaveDecor side="right" top="20%" opacity={0.3} color="#a855f7" />

                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="page-header"
                    >
                        <h1 className="page-title">
                            {getLocalized(sections.hero, 'title').split(' ').map((word, idx) => (
                                idx === 1 ? <span key={idx} className="gradient-text">{word} </span> : word + ' '
                            ))}
                        </h1>
                        <p className="page-desc">
                            {getLocalized(sections.hero, 'description')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-header center mb-12"
                    >
                        <h2 className="section-title text-center">{getLocalized(sections.benefits_header, 'title')}</h2>
                    </motion.div>

                    <div className="benefits-grid">
                        {items.benefits.map((b, i) => (
                            <motion.div
                                key={b.id}
                                className="benefit-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="benefit-icon-wrapper">{renderIcon(b.icon)}</div>
                                <div className="benefit-content">
                                    <h3>{getLocalized(b, 'title')}</h3>
                                    <p>{getLocalized(b, 'description')}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Participation Types Section */}
            <section className="section-padding bg-light">
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="section-tag">ФОРМАТЫ</span>
                        <h2 className="clean-heading">{getLocalized(sections.types_header, 'title')}</h2>
                        <p className="clean-text mx-auto">{getLocalized(sections.types_header, 'description')}</p>
                    </div>

                    <div className="types-grid-premium">
                        {items.types.map((type, i) => (
                            <motion.div
                                key={type.id}
                                className="type-card-premium"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="type-icon-box">{renderIcon(type.icon)}</div>
                                <h3 className="type-title-premium">{getLocalized(type, 'title')}</h3>
                                <ul className="type-benefits-premium">
                                    {parseList(getLocalized(type, 'benefits_list')).map((item, idx) => (
                                        <li key={idx}>
                                            <CheckCircle size={18} className="check-icon-premium" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements & Info Section */}
            <section className="section-padding">
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="section-tag">КРИТЕРИИ</span>
                        <h2 className="clean-heading">{getLocalized(sections.req_header, 'title')}</h2>
                    </div>

                    <div className="requirements-grid-premium">
                        {items.requirements.map((req, i) => (
                            <motion.div
                                key={req.id}
                                className="req-card-premium"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="req-header">
                                    <div className="req-number">0{i + 1}</div>
                                    <h4>{getLocalized(req, 'title')}</h4>
                                </div>
                                <ul className="req-list-premium">
                                    {parseList(getLocalized(req, 'items_list')).map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Join Section */}
            <section className="how-to-join">
                <div className="container steps-container">
                    <div className="text-center mb-16">
                        <h2 className="section-title">{getLocalized(sections.steps_header, 'title')}</h2>
                    </div>

                    <div className="steps-timeline">
                        <div className="steps-line"></div>

                        {items.steps.map((step, i) => (
                            <div key={step.id} className={`step-item ${i % 2 !== 0 ? 'even' : ''}`}>
                                <div className="step-number">{step.step_num || i + 1}</div>
                                <div className="step-content">
                                    <h4 className="step-title">{getLocalized(step, 'title')}</h4>
                                    <p className="step-desc">{getLocalized(step, 'description')}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="join-cta">
                        <motion.button
                            className="primary-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                        >
                            {getLocalized(sections.steps_header, 'cta_text') || 'Заполнить анкету участника'}
                        </motion.button>
                    </div>
                </div>
            </section>

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type="membership"
            />
        </div>
    );
};

export default Participants;
