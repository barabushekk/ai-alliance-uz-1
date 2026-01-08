import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Play, Book, Calendar, Eye, ArrowRight } from 'lucide-react';
import './Knowledge.css';

// Use placeholder images from unsplash
const roadmapImg = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop';
const courseImg = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=450&fit=crop';
const analyticsImg = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop';
const ethicsImg = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop';

const Knowledge = () => {
    const resources = [
        {
            title: 'Дорожная карта ИИ в Узбекистане 2024-2030',
            description: 'Комплексная стратегия развития искусственного интеллекта в Узбекистане с детальными этапами реализации, ключевыми показателями и планом действий на ближайшие 6 лет.',
            type: 'PDF',
            category: 'Стратегические документы',
            icon: <FileText size={24} />,
            size: '2.4 MB',
            pages: '48 страниц',
            date: '15 Янв 2024',
            downloads: '1,234',
            image: roadmapImg
        },
        {
            title: 'Основы ИИ для госслужащих',
            description: 'Интерактивный онлайн-курс, разработанный специально для государственных служащих. Включает видеолекции, практические задания и тесты для понимания основ искусственного интеллекта.',
            type: 'Онлайн-курс',
            category: 'Образование',
            icon: <Play size={24} />,
            size: '12 модулей',
            pages: '24 часа',
            date: '10 Дек 2024',
            downloads: '856',
            image: courseImg
        },
        {
            title: 'Отчет: Рынок ИИ в Центральной Азии',
            description: 'Глубокий аналитический отчет о состоянии рынка искусственного интеллекта в регионе Центральной Азии с прогнозами развития, анализом конкурентов и возможностей для инвестиций.',
            type: 'PDF',
            category: 'Аналитика и исследования',
            icon: <FileText size={24} />,
            size: '5.1 MB',
            pages: '72 страницы',
            date: '05 Дек 2024',
            downloads: '2,145',
            image: analyticsImg
        },
        {
            title: 'Белая книга по этике данных',
            description: 'Фундаментальный документ, определяющий этические принципы работы с данными и искусственным интеллектом. Включает рекомендации по защите прав граждан и ответственному использованию ИИ.',
            type: 'PDF',
            category: 'Этика и регулирование',
            icon: <Book size={24} />,
            size: '3.8 MB',
            pages: '56 страниц',
            date: '20 Ноя 2024',
            downloads: '1,678',
            image: ethicsImg
        }
    ];

    const stats = [
        { value: '25+', label: 'Публикаций' },
        { value: '10K+', label: 'Скачиваний' },
        { value: '8', label: 'Курсов' },
        { value: '15', label: 'Исследований' }
    ];

    return (
        <div className="page-standard knowledge-page">
            {/* Hero Section */}
            <section className="page-hero hero-knowledge">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="page-header"
                    >
                        <h1 className="page-title">
                            База <span className="gradient-text">Знаний</span>
                        </h1>
                        <p className="page-desc">
                            Актуальные материалы, исследования и образовательные ресурсы для профессионалов в области ИИ.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="knowledge-stats-section">
                <div className="container">
                    <div className="stats-grid">
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

            {/* Resources Section */}
            <section className="resources-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Библиотека ресурсов</h2>
                        <p className="section-subtitle">Документы, курсы и исследования для развития компетенций в ИИ</p>
                    </div>

                    <div className="resources-list">
                        {resources.map((resource, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="resource-card-featured"
                            >
                                <div className="resource-image-wrapper">
                                    <img src={resource.image} alt={resource.title} className="resource-image" />
                                    <div className="resource-type-badge">
                                        {resource.icon}
                                        <span>{resource.type}</span>
                                    </div>
                                </div>

                                <div className="resource-content">
                                    <div className="resource-category-tag">{resource.category}</div>
                                    <h3 className="resource-title">{resource.title}</h3>
                                    <p className="resource-description">{resource.description}</p>

                                    <div className="resource-meta">
                                        <div className="meta-item">
                                            <FileText size={16} />
                                            <span>{resource.size}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Book size={16} />
                                            <span>{resource.pages}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Calendar size={16} />
                                            <span>{resource.date}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Download size={16} />
                                            <span>{resource.downloads}</span>
                                        </div>
                                    </div>

                                    <div className="resource-actions">
                                        <button className="primary-btn">
                                            <Download size={18} />
                                            Скачать
                                        </button>
                                        <button className="secondary-btn">
                                            <Eye size={18} />
                                            Просмотр
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="knowledge-cta-section">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Book className="cta-icon" size={48} />
                        <h2 className="cta-title">Хотите поделиться знаниями?</h2>
                        <p className="cta-description">
                            Мы приглашаем экспертов и исследователей публиковать свои материалы в нашей базе знаний. Помогите сообществу расти и развиваться.
                        </p>
                        <button className="primary-btn">
                            Предложить публикацию
                            <ArrowRight size={18} />
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Knowledge;
