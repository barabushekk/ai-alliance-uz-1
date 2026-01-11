import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Play, Book, Calendar, Eye, ArrowRight, Loader } from 'lucide-react';
import DynamicIcon from '../components/DynamicIcon';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import './Knowledge.css';

const Knowledge = () => {
    const { i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState({
        hero: { title: 'База Знаний', description: 'Актуальные материалы...' },
        header: { title: 'Библиотека ресурсов', description: 'Документы, курсы...' },
        cta: { title: 'Хотите поделиться знаниями?', description: '', cta_text: 'Предложить публикацию', cta_link: '#' }
    });
    const [items, setItems] = useState({
        stats: [],
        resources: []
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
                { data: rData }
            ] = await Promise.all([
                supabase.from('knowledge_sections').select('*'),
                supabase.from('knowledge_stats').select('*').order('sort_order', { ascending: true }),
                supabase.from('knowledge_items').select('*').order('sort_order', { ascending: true })
            ]);

            if (sData) {
                const newSections = { ...sections };
                sData.forEach(s => newSections[s.key] = s);
                setSections(newSections);
            }

            setItems({
                stats: stData || [],
                resources: rData || []
            });
        } catch (error) {
            console.error('Error fetching knowledge data:', error);
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



    const getResourceIcon = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('курс') || t.includes('course') || t.includes('video')) return <Play size={24} />;
        if (t.includes('книга') || t.includes('book') || t.includes('white paper')) return <Book size={24} />;
        return <FileText size={24} />;
    };

    return (
        <div className="page-standard knowledge-page">
            <section className="page-hero hero-knowledge">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                        <h1 className="page-title">
                            {getLocalized(sections.hero, 'title').split(' ').map((word, idx) => (
                                <React.Fragment key={idx}>
                                    {idx === 1 ? <span className="gradient-text">{word} </span> : word + ' '}
                                </React.Fragment>
                            ))}
                        </h1>
                        <p className="page-desc">{getLocalized(sections.hero, 'description')}</p>
                    </motion.div>
                </div>
            </section>

            <section className="knowledge-stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {items.stats.map((stat, i) => (
                            <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="stat-card">
                                <div className="stat-icon" style={{ marginBottom: '10px', color: '#2563eb' }}><DynamicIcon name={stat.icon_name} /></div>
                                <h3 className="stat-value">{stat.value}</h3>
                                <p className="stat-label">{getLocalized(stat, 'label')}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="resources-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{getLocalized(sections.header, 'title')}</h2>
                        <p className="section-subtitle">{getLocalized(sections.header, 'description')}</p>
                    </div>

                    <div className="resources-list">
                        {items.resources.map((resource, i) => (
                            <motion.div key={resource.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="resource-card-featured">
                                <div className="resource-image-wrapper">
                                    <img src={resource.image_url || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80'} alt={getLocalized(resource, 'title')} className="resource-image" />
                                    <div className="resource-type-badge">
                                        {getResourceIcon(getLocalized(resource, 'type'))}
                                        <span>{getLocalized(resource, 'type')}</span>
                                    </div>
                                </div>

                                <div className="resource-content">
                                    <div className="resource-category-tag">{getLocalized(resource, 'category')}</div>
                                    <h3 className="resource-title">{getLocalized(resource, 'title')}</h3>
                                    <p className="resource-description">{getLocalized(resource, 'description')}</p>

                                    <div className="resource-meta">
                                        <div className="meta-item"><FileText size={16} /><span>{resource.size}</span></div>
                                        <div className="meta-item"><Book size={16} /><span>{getLocalized(resource, 'pages')}</span></div>
                                        <div className="meta-item"><Calendar size={16} /><span>{resource.date}</span></div>
                                        <div className="meta-item"><Download size={16} /><span>{resource.downloads}</span></div>
                                    </div>

                                    <div className="resource-actions">
                                        <a href={resource.file_url || '#'} className="primary-btn" style={{ textDecoration: 'none' }}>
                                            <Download size={18} />
                                            {i18n.language === 'en' ? 'Download' : (i18n.language === 'uz' ? 'Yuklab olish' : 'Скачать')}
                                        </a>
                                        <a href={resource.file_url || '#'} target="_blank" rel="noopener noreferrer" className="secondary-btn" style={{ textDecoration: 'none' }}>
                                            <Eye size={18} />
                                            {i18n.language === 'en' ? 'View' : (i18n.language === 'uz' ? 'Ko\'rish' : 'Просмотр')}
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="knowledge-cta-section">
                <div className="container">
                    <motion.div className="cta-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Book className="cta-icon" size={48} />
                        <h2 className="cta-title">{getLocalized(sections.cta, 'title')}</h2>
                        <p className="cta-description">{getLocalized(sections.cta, 'description')}</p>
                        <a href={sections.cta?.cta_link || '#'} className="primary-btn" style={{ textDecoration: 'none' }}>
                            {getLocalized(sections.cta, 'cta_text')}
                            <ArrowRight size={18} />
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Knowledge;

