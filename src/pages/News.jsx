import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag, Clock } from 'lucide-react';
import './News.css';

// Use placeholder images from unsplash
const partnershipImg = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=450&fit=crop';
const acceleratorImg = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop';
const forumImg = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop';

const News = () => {
    const newsItems = [
        {
            date: '24 Дек 2024',
            title: 'Альянс подписал меморандум с мировым лидером в области чипов',
            excerpt: 'Сотрудничество позволит локализовать разработку специализированного оборудования для ИИ.',
            description: 'Узбекский AI Alliance заключил стратегическое партнерство с ведущим производителем полупроводников. Соглашение предусматривает создание совместной лаборатории по разработке специализированных чипов для задач машинного обучения, а также программу обучения местных инженеров.',
            category: 'Партнерство',
            readTime: '5 мин',
            image: partnershipImg
        },
        {
            date: '15 Дек 2024',
            title: 'Старт программы AI Startups Uzbekistan',
            excerpt: 'Новый акселератор для проектов, использующих генеративный искусственный интеллект.',
            description: 'Запущена первая в Центральной Азии программа акселерации для AI-стартапов. Отобранные проекты получат финансирование до $100,000, менторскую поддержку от экспертов индустрии и доступ к вычислительным ресурсам. Прием заявок открыт до конца января.',
            category: 'Акселерация',
            readTime: '4 мин',
            image: acceleratorImg
        },
        {
            date: '02 Дек 2024',
            title: 'Форум "Будущее ИИ в Узбекистане"',
            excerpt: 'Более 500 экспертов собрались в Ташкенте для обсуждения векторов цифрового развития.',
            description: 'В столице прошел крупнейший форум по искусственному интеллекту в регионе. Ключевые спикеры из Google, Microsoft и локальных компаний обсудили перспективы развития ИИ-индустрии, вызовы регулирования и возможности для международного сотрудничества.',
            category: 'Событие',
            readTime: '6 мин',
            image: forumImg
        }
    ];

    const stats = [
        { value: '50+', label: 'Новостей' },
        { value: '12', label: 'Событий в месяц' },
        { value: '25K+', label: 'Читателей' }
    ];

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Партнерство': return 'category-partnership';
            case 'Акселерация': return 'category-acceleration';
            case 'Событие': return 'category-event';
            default: return 'category-default';
        }
    };

    return (
        <div className="page-standard news-page">
            {/* Hero Section */}
            <section className="page-hero hero-news">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="page-header"
                    >
                        <h1 className="page-title">
                            Новости и <span className="gradient-text">События</span>
                        </h1>
                        <p className="page-desc">
                            Следите за самыми важными событиями и изменениями в ИИ-индустрии Узбекистана.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="news-stats-section">
                <div className="container">
                    <div className="stats-grid-news">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="stat-card"
                            >
                                <h3 className="stat-value">{stat.value}</h3>
                                <p className="stat-label">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* News Section */}
            <section className="news-articles-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Последние новости</h2>
                        <p className="section-subtitle">Актуальная информация о развитии ИИ-экосистемы</p>
                    </div>

                    <div className="news-list">
                        {newsItems.map((item, i) => (
                            <motion.article
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="news-card-featured"
                            >
                                <div className="news-image-wrapper">
                                    <img src={item.image} alt={item.title} className="news-image" />
                                    <div className={`news-category-badge ${getCategoryColor(item.category)}`}>
                                        <Tag size={14} />
                                        <span>{item.category}</span>
                                    </div>
                                </div>

                                <div className="news-content">
                                    <div className="news-meta-header">
                                        <div className="meta-item">
                                            <Calendar size={16} />
                                            <span>{item.date}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Clock size={16} />
                                            <span>{item.readTime}</span>
                                        </div>
                                    </div>

                                    <h3 className="news-title">{item.title}</h3>
                                    <p className="news-excerpt">{item.excerpt}</p>
                                    <p className="news-description">{item.description}</p>

                                    <button className="read-more-btn">
                                        Читать полностью
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="news-cta-section">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Calendar className="cta-icon" size={48} />
                        <h2 className="cta-title">Подпишитесь на рассылку</h2>
                        <p className="cta-description">
                            Получайте еженедельный дайджест самых важных новостей и событий из мира ИИ в Узбекистане прямо на вашу почту.
                        </p>
                        <div className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Введите ваш email"
                                className="newsletter-input"
                            />
                            <button className="primary-btn">
                                Подписаться
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
