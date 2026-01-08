import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp, Sparkles } from 'lucide-react';
import './Projects.css';

// Import generated images
import aiStrategyImg from '../assets/project_ai_strategy_1767868825296.png';
import educationHubImg from '../assets/project_education_hub_1767868843176.png';
import dataPortalImg from '../assets/project_data_portal_1767868862397.png';
import uzbekLlmImg from '../assets/project_uzbek_llm_1767868878478.png';

const Projects = () => {
    const featuredProjects = [
        {
            title: 'Национальная стратегия ИИ',
            description: 'Участие в разработке комплексной дорожной карты развития искусственного интеллекта в Узбекистане до 2030 года. Проект включает анализ текущего состояния отрасли, определение приоритетных направлений и создание нормативно-правовой базы.',
            status: 'В процессе',
            timeline: '2024-2030',
            team: '15+ экспертов',
            impact: 'Национальный масштаб',
            tags: ['Госрегулирование', 'Стратегия', 'Политика'],
            image: aiStrategyImg
        },
        {
            title: 'AI Education Hub',
            description: 'Создание комплексной образовательной платформы для подготовки специалистов по Data Science, Machine Learning и AI. Включает онлайн-курсы, практические лаборатории и программы сертификации.',
            status: 'Запущено',
            timeline: '2023-2026',
            team: '25+ преподавателей',
            impact: '5000+ студентов',
            tags: ['Образование', 'Таланты', 'E-Learning'],
            image: educationHubImg
        },
        {
            title: 'Open Data Portal 2.0',
            description: 'Интеграция передовых ИИ-инструментов для анализа и визуализации открытых государственных данных. Платформа обеспечивает прозрачность и помогает в принятии решений на основе данных.',
            status: 'Планируется',
            timeline: '2025-2027',
            team: '10+ разработчиков',
            impact: 'Все госорганы',
            tags: ['Big Data', 'GovTech', 'Аналитика'],
            image: dataPortalImg
        },
        {
            title: 'Узбекская LLM',
            description: 'Разработка большой языковой модели, специально адаптированной под узбекский язык и культурный контекст. Проект направлен на создание суверенных ИИ-технологий для национальных нужд.',
            status: 'В разработке',
            timeline: '2024-2026',
            team: '20+ исследователей',
            impact: 'Технологический прорыв',
            tags: ['NLP', 'Инновации', 'R&D'],
            image: uzbekLlmImg
        }
    ];

    const stats = [
        { value: '12+', label: 'Активных проектов' },
        { value: '50+', label: 'Партнерских организаций' },
        { value: '100K+', label: 'Бенефициаров' },
        { value: '$5M+', label: 'Инвестиций' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Запущено': return 'status-active';
            case 'В процессе': return 'status-progress';
            case 'В разработке': return 'status-development';
            case 'Планируется': return 'status-planned';
            default: return 'status-default';
        }
    };

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
                            Проекты и <span className="gradient-text">Инициативы</span>
                        </h1>
                        <p className="page-desc">
                            Флагманские проекты Альянса, направленные на технологический прорыв и цифровую трансформацию Узбекистана.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="projects-stats-section">
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

            {/* Featured Projects Section */}
            <section className="featured-projects-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Флагманские проекты</h2>
                        <p className="section-subtitle">Ключевые инициативы, формирующие будущее ИИ в Узбекистане</p>
                    </div>

                    <div className="projects-list">
                        {featuredProjects.map((project, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="project-card-featured"
                            >
                                <div className="project-image-wrapper">
                                    <img src={project.image} alt={project.title} className="project-image" />
                                    <div className={`project-status-badge ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </div>
                                </div>

                                <div className="project-content">
                                    <h3 className="project-title">{project.title}</h3>
                                    <p className="project-description">{project.description}</p>

                                    <div className="project-meta">
                                        <div className="meta-item">
                                            <Calendar size={18} />
                                            <span>{project.timeline}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Users size={18} />
                                            <span>{project.team}</span>
                                        </div>
                                        <div className="meta-item">
                                            <TrendingUp size={18} />
                                            <span>{project.impact}</span>
                                        </div>
                                    </div>

                                    <div className="project-tags">
                                        {project.tags.map((tag, idx) => (
                                            <span key={idx} className="project-tag">{tag}</span>
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
                        <h2 className="cta-title">Есть идея проекта?</h2>
                        <p className="cta-description">
                            Мы всегда открыты для новых инициатив в области искусственного интеллекта. Предложите свой проект и станьте частью технологической революции.
                        </p>
                        <button className="primary-btn">Предложить проект</button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Projects;
