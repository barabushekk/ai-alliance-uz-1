import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag, Clock, Loader } from 'lucide-react';
import DynamicIcon from '../components/DynamicIcon';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import './News.css';

const News = () => {
    const { i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState({
        hero: { title: 'Новости и События', description: 'Следите за самыми важными...' },
        header: { title: 'Последние новости', description: '' }
    });
    const [items, setItems] = useState({
        stats: [],
        news: []
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
                { data: nData }
            ] = await Promise.all([
                supabase.from('news_sections').select('*'),
                supabase.from('news_stats').select('*').order('sort_order', { ascending: true }),
                supabase.from('news_items').select('*').order('sort_order', { ascending: true })
            ]);

            if (sData) {
                const newSections = { ...sections };
                sData.forEach(s => newSections[s.key] = s);
                setSections(newSections);
            }

            setItems({
                stats: stData || [],
                news: nData || []
            });
        } catch (error) {
            console.error('Error fetching news data:', error);
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

    const getCategoryColor = (category) => {
        const cat = (category || '').toLowerCase();
        if (cat.includes('партнер') || cat.includes('partner')) return 'category-partnership';
        if (cat.includes('акселер') || cat.includes('acceler')) return 'category-acceleration';
        if (cat.includes('событ') || cat.includes('event')) return 'category-event';
        return 'category-default';
    };



    if (loading) return <div className="page-standard"><div className="loading-container fixed-loader"><div className="loader-aesthetic"></div></div></div>;

    return (
        <div className="page-standard news-page">
            <section className="page-hero hero-news">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                        <h1 className="page-title">
                            {getLocalized(sections.hero, 'title').split(' ').map((word, idx) => (
                                <React.Fragment key={idx}>
                                    {idx === 2 ? <span className="gradient-text">{word} </span> : word + ' '}
                                </React.Fragment>
                            ))}
                        </h1>
                        <p className="page-desc">{getLocalized(sections.hero, 'description')}</p>
                    </motion.div>
                </div>
            </section>

            <section className="news-stats-section">
                <div className="container">
                    <div className="stats-grid-news">
                        {items.stats.length > 0 ? items.stats.map((stat, i) => (
                            <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="stat-card">
                                <div className="stat-icon" style={{ marginBottom: '10px', color: '#2563eb' }}><DynamicIcon name={stat.icon_name} /></div>
                                <h3 className="stat-value">{stat.value}</h3>
                                <p className="stat-label">{getLocalized(stat, 'label')}</p>
                            </motion.div>
                        )) : [
                            { value: '50+', label: 'Новостей' },
                            { value: '12', label: 'Событий в месяц' },
                            { value: '25K+', label: 'Читателей' }
                        ].map((stat, i) => (
                            <div key={i} className="stat-card">
                                <h3 className="stat-value">{stat.value}</h3>
                                <p className="stat-label">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="news-articles-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{getLocalized(sections.header, 'title')}</h2>
                        <p className="section-subtitle">{getLocalized(sections.header, 'description')}</p>
                    </div>

                    <div className="news-list">
                        {items.news.map((item, i) => (
                            <motion.article key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="news-card-featured">
                                <div className="news-image-wrapper">
                                    <img src={item.image_url || 'https://images.unsplash.com/photo-1504711432869-5d39a110f444?auto=format&fit=crop&q=80'} alt={getLocalized(item, 'title')} className="news-image" />
                                    <div className={`news-category-badge ${getCategoryColor(getLocalized(item, 'category'))}`}>
                                        <Tag size={14} />
                                        <span>{getLocalized(item, 'category')}</span>
                                    </div>
                                </div>

                                <div className="news-content">
                                    <div className="news-meta-header">
                                        <div className="meta-item"><Calendar size={16} /><span>{item.date}</span></div>
                                        <div className="meta-item"><Clock size={16} /><span>{getLocalized(item, 'read_time')}</span></div>
                                    </div>
                                    <h3 className="news-title">{getLocalized(item, 'title')}</h3>
                                    <p className="news-excerpt">{getLocalized(item, 'excerpt')}</p>
                                    <p className="news-description">{getLocalized(item, 'description')}</p>
                                    <button className="read-more-btn">
                                        {i18n.language === 'en' ? 'Read More' : (i18n.language === 'uz' ? 'Batafsil' : 'Читать полностью')}
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="news-cta-section">
                <div className="container">
                    <motion.div className="cta-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Calendar className="cta-icon" size={48} />
                        <h2 className="cta-title">{getLocalized(sections.newsletter, 'title') || 'Подпишитесь на рассылку'}</h2>
                        <p className="cta-description">{getLocalized(sections.newsletter, 'description') || 'Получайте еженедельный дайджест самых важных новостей.'}</p>
                        <div className="newsletter-form">
                            <input
                                type="email"
                                placeholder={getLocalized(sections.newsletter, 'cta_placeholder') || 'Введите ваш email'}
                                className="newsletter-input"
                            />
                            <button className="primary-btn">
                                {getLocalized(sections.newsletter, 'cta_button') || 'Подписаться'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default News;

