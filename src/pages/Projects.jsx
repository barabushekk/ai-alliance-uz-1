import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp, Sparkles, Loader } from 'lucide-react';
import DynamicIcon from '../components/DynamicIcon';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import './Projects.css';

const Projects = () => {
    const { i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState({
        hero: { title: 'Проекты и Инициативы', description: 'Флагманские проекты Альянса...' },
        projects_header: { title: 'Флагманские проекты', description: 'Ключевые инициативы...' },
        cta: { title: 'Есть идея проекта?', description: '', cta_text: 'Предложить проект', cta_link: '#' }
    });
    const [items, setItems] = useState({
        stats: [],
        projects: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [
                { data: sData },
                { data: stData },
                { data: pData }
            ] = await Promise.all([
                supabase.from('projects_sections').select('*'),
                supabase.from('projects_stats').select('*').order('sort_order', { ascending: true }),
                supabase.from('projects_items').select('*').order('sort_order', { ascending: true })
            ]);

            if (sData) {
                const newSections = { ...sections };
                sData.forEach(s => newSections[s.key] = s);
                setSections(newSections);
            }

            setItems({
                stats: stData || [],
                projects: pData || []
            });

        } catch (error) {
            console.error('Error fetching projects data:', error);
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

    const getStatusColor = (status) => {
        // Handle Russian or other translation variants
        const s = (status || '').toLowerCase();
        if (s.includes('запущено') || s.includes('launched') || s.includes('ishga')) return 'status-active';
        if (s.includes('процессе') || s.includes('progress') || s.includes('jarayon')) return 'status-progress';
        if (s.includes('разработке') || s.includes('development') || s.includes('ishlab')) return 'status-development';
        if (s.includes('планируется') || s.includes('planned') || s.includes('rejalashtirilgan')) return 'status-planned';
        return 'status-default';
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
        <div className="page-standard projects-page">
            {/* Hero Section */}
            <section className="page-hero hero-projects">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="page-header"
                    >
                        <h1 className="page-title">
                            {getLocalized(sections.hero, 'title').split(' ').map((word, idx) => (
                                idx === 2 ? <span key={idx} className="gradient-text">{word} </span> : word + ' '
                            ))}
                        </h1>
                        <p className="page-desc">
                            {getLocalized(sections.hero, 'description')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="projects-stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {items.stats.map((stat, i) => (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="stat-card"
                            >
                                <div className="stat-icon" style={{ marginBottom: '10px', color: '#2563eb' }}><DynamicIcon name={stat.icon_name} /></div>
                                <h3 className="stat-value">{getLocalized(stat, 'value')}</h3>
                                <p className="stat-label">{getLocalized(stat, 'label')}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="featured-projects-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{getLocalized(sections.projects_header, 'title')}</h2>
                        <p className="section-subtitle">{getLocalized(sections.projects_header, 'description')}</p>
                    </div>

                    <div className="projects-list">
                        {items.projects.map((project, i) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="project-card-featured"
                            >
                                <div className="project-image-wrapper">
                                    <img
                                        src={project.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'}
                                        alt={getLocalized(project, 'title')}
                                        className="project-image"
                                    />
                                    <div className={`project-status-badge ${getStatusColor(getLocalized(project, 'status'))}`}>
                                        {getLocalized(project, 'status')}
                                    </div>
                                </div>

                                <div className="project-content">
                                    <h3 className="project-title">{getLocalized(project, 'title')}</h3>
                                    <p className="project-description">{getLocalized(project, 'description')}</p>

                                    <div className="project-meta">
                                        <div className="meta-item">
                                            <Calendar size={18} />
                                            <span>{getLocalized(project, 'timeline')}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Users size={18} />
                                            <span>{getLocalized(project, 'team')}</span>
                                        </div>
                                        <div className="meta-item">
                                            <TrendingUp size={18} />
                                            <span>{getLocalized(project, 'impact')}</span>
                                        </div>
                                    </div>

                                    <div className="project-tags">
                                        {(getLocalized(project, 'tags') || '').split(',').map((tag, idx) => (
                                            <span key={idx} className="project-tag">{tag.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="projects-cta-section">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles className="cta-icon" size={48} />
                        <h2 className="cta-title">{getLocalized(sections.cta, 'title')}</h2>
                        <p className="cta-description">
                            {getLocalized(sections.cta, 'description')}
                        </p>
                        <motion.a
                            href={sections.cta?.cta_link || '#'}
                            className="primary-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ textDecoration: 'none' }}
                        >
                            {getLocalized(sections.cta, 'cta_text') || 'Предложить проект'}
                        </motion.a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Projects;

