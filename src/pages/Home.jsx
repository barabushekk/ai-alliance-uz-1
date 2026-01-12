import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Database, Globe, Lightbulb, BookOpen, Shield, Cpu, Network, Target, Monitor, Zap, Calendar } from 'lucide-react';
import Hero from '../components/Hero';
import WaveDecor from '../components/WaveDecor';
import './Home.css';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import ApplicationModal from '../components/ApplicationModal';

// Icon mapping
const iconMap = {
    'Globe': Globe,
    'BookOpen': BookOpen,
    'Shield': Shield,
    'Lightbulb': Lightbulb,
    'Database': Database,
    'Cpu': Cpu,
    'Network': Network,
    'Target': Target,
    'Monitor': Monitor,
    'Zap': Zap,
    'Users': Users,
    'Circle': Globe // Fallback
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

const Home = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);

    // Initial state with fallbacks matching original hardcoded data
    const [sections, setSections] = useState({
        about_preview: { title: 'Интеллектуальный потенциал \nцифровой экономики', description: 'Альянс объединяет ведущие технологические компании для развития рынка ИИ в Узбекистане...' },
        projects_heading: { title: 'Ключевые проекты', description: '' },
        wg_heading: { title: 'Экспертиза и стандарты', description: 'Мы разрабатываем фундамент для безопасного и этичного ИИ...' },
        feature_main: { title: 'Роль технологий ИИ \nв развитии компании сегодня', description: 'Технологии ИИ существенно трансформируют деятельность компаний...' },
        feature_exp: { title: 'ОПЫТ ПРИМЕНЕНИЯ', description: 'Альянс создал и активно развивает проект AI Russia...' },
        mission_left: { title: 'Миссия', description: 'Быть центром развития искусственного интеллекта в регионе...' },
        mission_right: { title: 'Альянс — открытая структура', description: 'Для развития искусственного интеллекта необходимо объединять усилия...' },
        home_cta: { title: 'Стать участником' }
    });

    const [items, setItems] = useState({
        projects: [],
        working_groups: [],
        feature_advantages: [],
        partners: [],
        about_stats: [],
        news: []
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [
                { data: sectionsData },
                { data: itemsData },
                { data: statsData },
                { data: nData }
            ] = await Promise.all([
                supabase.from('home_sections').select('*'),
                supabase.from('home_items').select('*').order('sort_order', { ascending: true }),
                supabase.from('about_stats').select('*').order('sort_order', { ascending: true }),
                supabase.from('news_items').select('*')
                    .eq('is_active', true)
                    .order('is_featured', { ascending: false })
                    .order('sort_order', { ascending: true })
                    .limit(3)
            ]);

            if (sectionsData) {
                const newSections = { ...sections };
                sectionsData.forEach(item => {
                    newSections[item.key] = item;
                });
                setSections(newSections);
            }

            setItems({
                projects: itemsData ? itemsData.filter(i => i.section_key === 'projects') : [],
                working_groups: itemsData ? itemsData.filter(i => i.section_key === 'working_groups') : [],
                feature_advantages: itemsData ? itemsData.filter(i => i.section_key === 'feature_advantages') : [],
                partners: itemsData ? itemsData.filter(i => i.section_key === 'partners') : [],
                about_stats: statsData || [],
                news: nData || []
            });
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLocalized = (item, field) => {
        if (!item) return '';
        const lang = i18n.language;
        if (lang === 'ru') return item[field] || '';
        const localizedValue = item[`${field}_${lang}`];
        return localizedValue || item[field] || '';
    };

    const renderIcon = (iconName) => {
        const Icon = iconMap[iconName] || Globe;
        return <Icon />;
    };

    if (loading) {
        return (
            <div className="page-standard home-page">
                <div className="loading-container fixed-loader">
                    <div className="loader-aesthetic"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Decor */}
            <WaveDecor side="left" top="-10%" color="#349CD6" opacity={0.4} />
            <WaveDecor side="right" top="20%" color="#3D51A0" opacity={0.3} />
            <WaveDecor side="left" top="50%" color="#3D51A0" opacity={0.25} />
            <WaveDecor side="right" top="80%" color="#C850C0" opacity={0.3} />

            <Hero />

            {/* About Section */}
            <section className="section-padding">
                <div className="container">
                    <div className="clean-about-layout">
                        <motion.div
                            className="about-content-left"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="section-tag">{t('home_page.about_tag')}</div>
                            <h2 className="clean-heading" style={{ whiteSpace: 'pre-line' }}>
                                {getLocalized(sections.about_preview, 'title')}
                            </h2>
                            <p className="clean-text" style={{ marginBottom: '40px' }}>
                                {getLocalized(sections.about_preview, 'description')}
                            </p>

                            <Link to="/about" className="btn-clean-primary">
                                {getLocalized(sections.about_preview, 'cta_text') || 'Узнать больше'}
                            </Link>
                        </motion.div>

                        {/* Static Visuals - Hide if empty */}
                        {items.about_stats.length > 0 && (
                            <div className="about-visual-right">
                                <div className="abstract-card-stack">
                                    {items.about_stats.slice(0, 4).map((stat, idx) => (
                                        <div key={stat.id} className={`metric-card mc-${idx + 1}`}>
                                            <div className="mc-icon">{renderIcon(stat.icon)}</div>
                                            <div className="mc-info">
                                                <span className="mc-val">{stat.value}</span>
                                                <span className="mc-lbl">{getLocalized(stat, 'label')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            {sections.projects_heading?.is_active !== false && (
                <section className="section-padding bg-light">
                    <div className="container">
                        <div className="flex-header">
                            <div>
                                <div className="section-tag">{t('home_page.projects_tag')}</div>
                                <h2 className="clean-heading">{getLocalized(sections.projects_heading, 'title')}</h2>
                            </div>
                            <Link to="/projects" className="link-u">{t('home_page.all_projects')} <ArrowRight size={16} /></Link>
                        </div>

                        <div className="projects-grid-3col">
                            {items.projects.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    className="project-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <span className="proj-status">Активен</span>
                                    <div className="proj-icon-box">{renderIcon(p.icon)}</div>
                                    <h3>{getLocalized(p, 'title')}</h3>
                                    <p>{getLocalized(p, 'description')}</p>
                                    <div className="proj-footer">
                                        {p.link ? (
                                            <a href={p.link} target="_blank" rel="noreferrer" className="link-text" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                Подробнее <ArrowRight size={14} />
                                            </a>
                                        ) : (
                                            <span className="link-text">Подробнее</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Working Groups */}
            <section className="wg-section-light">
                <div className="container">
                    <div className="wg-layout">
                        <div className="wg-left-content">
                            <span className="section-tag">{t('home_page.groups_tag')}</span>
                            <h2>{getLocalized(sections.wg_heading, 'title')}</h2>
                            <p>
                                {getLocalized(sections.wg_heading, 'description')}
                            </p>
                        </div>

                        <div className="wg-list">
                            {items.working_groups.map((wg, i) => (
                                <div key={wg.id} className="wg-item-row">
                                    <div className="wg-icon">{renderIcon(wg.icon)}</div>
                                    <div className="wg-text">
                                        <h4>{getLocalized(wg, 'title')}</h4>
                                        <p>{getLocalized(wg, 'description')}</p>
                                    </div>
                                    <ArrowRight size={16} color="#cbd5e1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="container">
                <div className="section-blue">
                    <svg className="wave-deco" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" stroke="#3b82f6" strokeWidth="2" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,192C1248,224,1344,224,1392,224L1440,224" opacity="0.3"></path>
                    </svg>

                    <div className="feature-layout">
                        <div className="feature-left">
                            <h2 style={{ whiteSpace: 'pre-line' }}>
                                {getLocalized(sections.feature_main, 'title')}
                            </h2>
                            <p>
                                {getLocalized(sections.feature_main, 'description')}
                            </p>
                            <div style={{ marginTop: '40px' }}>
                                <div className="section-tag">{getLocalized(sections.feature_exp, 'title')}</div>
                                <p style={{ fontSize: '14px', maxWidth: '400px' }}>
                                    {getLocalized(sections.feature_exp, 'description')}
                                </p>
                            </div>
                        </div>
                        <div className="feature-right">
                            <div className="section-tag" style={{ marginBottom: '24px' }}>{t('home_page.advantages_tag')}</div>
                            <div className="feature-list">
                                {items.feature_advantages.map((item, i) => (
                                    <div key={item.id} className="feature-item">
                                        <span className="feature-dash">—</span>
                                        <span>{getLocalized(item, 'title')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent News Section */}
            <section className="section-padding bg-secondary" style={{ borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
                <div className="container">
                    <div className="flex-header">
                        <div>
                            <div className="section-tag">{t('home_page.news_tag')}</div>
                            <h2 className="clean-heading">{t('home_page.news_title')}</h2>
                            <p className="clean-text">{t('home_page.news_subtitle')}</p>
                        </div>
                        <Link to="/news" className="link-u">{t('home_page.all_news')} <ArrowRight size={16} /></Link>
                    </div>

                    {items.news.length > 0 ? (
                        <div className="home-news-grid">
                            {items.news.map((item, i) => (
                                <motion.article
                                    key={item.id}
                                    className="home-news-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link to={`/news/${item.slug || item.id}`} className="hnc-image-link">
                                        <div className="hnc-image-wrapper">
                                            <img src={item.image_url} alt={getLocalized(item, 'title')} />
                                        </div>
                                    </Link>
                                    <div className="hnc-content">
                                        <div className="hnc-meta">
                                            <Calendar size={14} />
                                            <span>{getLocalized(item, 'date')}</span>
                                        </div>
                                        <Link to={`/news/${item.slug || item.id}`} className="hnc-title-link">
                                            <h3>{getLocalized(item, 'title')}</h3>
                                        </Link>
                                        <p>{getLocalized(item, 'excerpt')}</p>
                                        <Link to={`/news/${item.slug || item.id}`} className="hnc-more">
                                            {t('news_page.read_more')} <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            {t('home_page.no_news_yet') || 'Новости скоро появятся...'}
                        </div>
                    )}
                </div>
            </section>

            {/* Partners & Mission Section */}
            <section className="section-padding">
                <div className="container">
                    {/* Partners Card */}
                    {sections.partners_section?.is_active !== false && (
                        <div className="partners-card">
                            <div className="partners-unified-grid">
                                {items.partners.map((p, i) => (
                                    <div key={p.id} className="partner-logo-plain">
                                        {p.image_url ? (
                                            <img src={p.image_url} alt={p.title} style={{ height: '45px', width: 'auto', maxWidth: '160px', objectFit: 'contain', filter: 'grayscale(100%) brightness(0.8)', transition: 'all 0.3s ease' }} className="partner-img" />
                                        ) : (
                                            p.title
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mission Split */}
                    <div className="mission-split">
                        <div className="mission-col">
                            <h4>{getLocalized(sections.mission_left, 'title')}</h4>
                            <p>{getLocalized(sections.mission_left, 'description')}</p>
                        </div>
                        <div className="mission-col">
                            <h4>{getLocalized(sections.mission_right, 'title')}</h4>
                            <p>{getLocalized(sections.mission_right, 'description')}</p>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '80px', marginBottom: '80px' }}>
                        <button className="btn-clean-outline" onClick={() => setIsModalOpen(true)} style={{ background: 'none', border: '1px solid #4a5568', color: '#4a5568', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {getLocalized(sections.home_cta, 'title')}
                        </button>
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

export default Home;
