import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import './News.css';

const News = () => {
    const newsItems = [
        {
            date: '24 Дек 2025',
            title: 'Альянс подписал меморандум с мировым лидером в области чипов',
            desc: 'Сотрудничество позволит локализовать разработку специализированного оборудования для ИИ.',
            category: 'Партнерство'
        },
        {
            date: '15 Дек 2025',
            title: 'Старт программы AI Startups Uzbekistan',
            desc: 'Новый акселератор для проектов, использующих генеративный искусственный интеллект.',
            category: 'Акселерация'
        },
        {
            date: '02 Дек 2025',
            title: 'Форум "Будущее ИИ в Узбекистане"',
            desc: 'Более 500 экспертов собрались в Ташкенте для обсуждения векторов цифрового развития.',
            category: 'Событие'
        }
    ];

    return (
        <div className="page-standard news-page">
            <section className="page-hero hero-news">
                <div className="container">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-header">
                        <h1 className="page-title">Новости и <span className="gradient-text">События</span></h1>
                        <p className="page-desc">Следите за самыми важными изменениями в ИИ-индустрии страны.</p>
                    </motion.div>
                </div>
            </section>

            <div className="container">

                <div className="news-grid">
                    {newsItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="news-card"
                        >
                            <div className="news-header">
                                <span className="news-category">{item.category}</span>
                                <div className="news-date"><Calendar size={14} /> {item.date}</div>
                            </div>
                            <div className="news-content">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <button className="read-more">Читать далее <ArrowRight size={16} /></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default News;
