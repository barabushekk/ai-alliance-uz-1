import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Play, Book } from 'lucide-react';
import './Knowledge.css';

const Knowledge = () => {
    const resources = [
        { title: 'Дорожная карта ИИ в Узбекистане 2024', type: 'PDF', category: 'Документы', icon: <FileText /> },
        { title: 'Основы ИИ для госслужащих', type: 'Course', category: 'Обучение', icon: <Play /> },
        { title: 'Отчет: Рынок ИИ в Центральной Азии', type: 'PDF', category: 'Аналитика', icon: <FileText /> },
        { title: 'Белая книга по этике данных', type: 'PDF', category: 'Этика', icon: <Book /> },
    ];

    return (
        <div className="page-standard knowledge-page">
            <section className="page-hero hero-knowledge">
                <div className="container">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-header">
                        <h1 className="page-title">Публикации и <span className="gradient-text">Знания</span></h1>
                        <p className="page-desc">Актуальные материалы, исследования и документы для профессионалов.</p>
                    </motion.div>
                </div>
            </section>

            <div className="container">

                <div className="knowledge-grid">
                    {resources.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="resource-card"
                        >
                            <div className="resource-icon">{r.icon}</div>
                            <div className="resource-info">
                                <span className="resource-category">{r.category}</span>
                                <h3>{r.title}</h3>
                            </div>
                            <button className="download-btn"><Download size={20} /></button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Knowledge;
