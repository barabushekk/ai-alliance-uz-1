import React from 'react';
import { motion } from 'framer-motion';
import './Partners.css';

const Partners = () => {
    const partners = [
        { name: 'Uztelecom', category: 'Государственные компании', logo: 'UT' },
        { name: 'EPAM Uzbekistan', category: 'Технологические гиганты', logo: 'E' },
        { name: 'Ucell', category: 'Телекоммуникации', logo: 'UC' },
        { name: 'Inha University', category: 'Образование', logo: 'IU' },
        { name: 'Amity University', category: 'Образование', logo: 'AU' },
        { name: 'IT Park', category: 'Инкубаторы', logo: 'IP' },
    ];

    return (
        <div className="page-standard partners-page">
            <section className="page-hero hero-partners">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="page-header"
                    >
                        <h1 className="page-title">Партнеры и <span className="gradient-text">Участники</span></h1>
                        <p className="page-desc">Сообщество лидеров, формирующих цифровой суверенитет Узбекистана.</p>
                    </motion.div>
                </div>
            </section>

            <div className="container">

                <div className="partners-grid">
                    {partners.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="partner-card"
                        >
                            <div className="partner-logo-box">{p.logo}</div>
                            <div className="partner-info">
                                <h3>{p.name}</h3>
                                <p>{p.category}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <section className="join-invitation">
                    <div className="cta-box">
                        <h2>Станьте частью Альянса</h2>
                        <p>Мы открыты для новых партнерств с инновационными компаниями и исследовательскими центрами.</p>
                        <button className="primary-btn">Подать заявку на вступление</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Partners;
