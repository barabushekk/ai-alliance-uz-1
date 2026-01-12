import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, ArrowRight, Tag, Clock, Loader } from 'lucide-react';
import DynamicIcon from '../components/DynamicIcon';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import './News.css';

const News = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
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
                supabase.from('news_items').select('*')
                    .order('is_featured', { ascending: false })
                    .order('sort_order', { ascending: true })
            ]);

            if (sData) {
                const newSections = { ...sections };
                sData.forEach(s => newSections[s.key] = s);
                setSections(newSections);
            }

            setItems({
                stats: stData || [],
                news: nData ? nData.filter(i => i.is_active !== false) : []
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

            {sections.stats_section?.is_active !== false && (
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
            )}

            <section className="news-articles-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{getLocalized(sections.header, 'title')}</h2>
                        <p className="section-subtitle">{getLocalized(sections.header, 'description')}</p>
                    </div>

                    <div className="news-main-container">
                        {items.news.length > 0 && (
                            <div className="news-featured-wrapper">
                                <motion.article
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="news-featured-card"
                                    onClick={() => navigate(`/news/${items.news[0].slug || items.news[0].id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="featured-image-side">
                                        <img src={items.news[0].image_url || 'https://images.unsplash.com/photo-1504711432869-5d39a110f444?auto=format&fit=crop&q=80'} alt={getLocalized(items.news[0], 'title')} />
                                        <div className={`news-category-badge ${getCategoryColor(getLocalized(items.news[0], 'category'))}`}>
                                            <Tag size={14} />
                                            <span>{getLocalized(items.news[0], 'category')}</span>
                                        </div>
                                    </div>
                                    <div className="featured-content-side">
                                        <div className="news-meta-header">
                                            <div className="meta-item"><Calendar size={16} /><span>{getLocalized(items.news[0], 'date')}</span></div>
                                        </div>
                                        <h3 className="news-title">{getLocalized(items.news[0], 'title')}</h3>
                                        <p className="news-excerpt">{getLocalized(items.news[0], 'excerpt')}</p>
                                        <Link to={`/news/${items.news[0].slug || items.news[0].id}`} className="read-more-btn" onClick={(e) => e.stopPropagation()}>
                                            {i18n.language === 'en' ? 'Read More' : (i18n.language === 'uz' ? 'Batafsil' : 'Читать полностью')}
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </motion.article>
                            </div>
                        )}

                        <div className="news-standard-grid">
                            {items.news.slice(1).map((item, i) => (
                                <motion.article
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="news-standard-card"
                                    onClick={() => navigate(`/news/${item.slug || item.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-image-wrapper">
                                        <img src={item.image_url || 'https://images.unsplash.com/photo-1504711432869-5d39a110f444?auto=format&fit=crop&q=80'} alt={getLocalized(item, 'title')} className="news-image" />
                                        <div className={`news-tag ${getCategoryColor(getLocalized(item, 'category'))}`}>
                                            {getLocalized(item, 'category')}
                                        </div>
                                    </div>

                                    <div className="card-content">
                                        <div className="card-meta">
                                            <span>{getLocalized(item, 'date')}</span>
                                        </div>
                                        <h3 className="card-title">{getLocalized(item, 'title')}</h3>
                                        <p className="card-excerpt">{getLocalized(item, 'excerpt')}</p>
                                        <Link to={`/news/${item.slug || item.id}`} className="card-link" onClick={(e) => e.stopPropagation()}>
                                            {i18n.language === 'en' ? 'Learn More' : (i18n.language === 'uz' ? 'Batafsil' : 'Подробнее')}
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {sections.newsletter?.is_active !== false && (
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
            )}
        </div>
    );
};

export default News;
