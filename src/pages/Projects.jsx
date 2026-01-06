import React from 'react';
import { motion } from 'framer-motion';
import './Projects.css';

const Projects = () => {
    const projects = [
        {
            title: 'Национальная стратегия ИИ',
            desc: 'Участие в разработке дорожной карты развития ИИ до 2030 года.',
            status: 'В процессе',
            tags: ['Госрегулирование', 'Стратегия']
        },
        {
            title: 'AI Education Hub',
            desc: 'Создание образовательной платформы для подготовки специалистов по Data Science.',
            status: 'Запущено',
            tags: ['Образование', 'Таланты']
        },
        {
            title: 'Open Data Portal 2.0',
            desc: 'Интеграция ИИ-инструментов для анализа открытых государственных данных.',
            status: 'Планируется',
            tags: ['Big Data', 'GovTech']
        },
        {
            title: 'Узбекская LLM',
            desc: 'Разработка большой языковой модели, адаптированной под узбекский язык и культуру.',
            status: 'В разработке',
            tags: ['NLP', 'Инновации']
        }
    ];

    return (
        <div className="page-standard projects-page">
            <section className="page-hero hero-projects">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="page-header"
                    >
                        <h1 className="page-title">Проекты и <span className="gradient-text">Инициативы</span></h1>
                        <p className="page-desc">Проекты, направленные на цифровой прорыв Узбекистана.</p>
                    </motion.div>
                </div>
            </section>

            <div className="container">

                <div className="projects-grid">
                    {projects.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="project-card"
                        >
                            <div className="project-status">{p.status}</div>
                            <div className="project-content">
                                <h3>{p.title}</h3>
                                <p>{p.desc}</p>
                                <div className="project-tags">
                                    {p.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
