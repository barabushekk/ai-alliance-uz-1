import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Globe, Users } from 'lucide-react';
import WaveDecor from '../components/WaveDecor';
import './Participants.css';

const Participants = () => {
    // Static data matching the premium style
    const benefits = [
        { title: 'Нетворкинг и Связи', desc: 'Эксклюзивный доступ к закрытому сообществу экспертов, руководителей ИИ-компаний и представителям государства.', icon: <Users size={32} /> },
        { title: 'Влияние на Отрасль', desc: 'Прямое участие в рабочих группах по формированию стратегии ИИ и нормативно-правовой базы.', icon: <Globe size={32} /> },
        { title: 'Ресурсы и Инфраструктура', desc: 'Льготный доступ к вычислительным мощностям, национальным датасетам и технологическим платформам.', icon: <Zap size={32} /> },
        { title: 'Статус и Репутация', desc: 'Позиционирование вашей компании как ключевого игрока технологической модернизации страны.', icon: <CheckCircle size={32} /> },
    ];

    return (
        <div className="page-standard participants-page">
            {/* Hero Section */}
            <section className="page-hero hero-participants">
                <WaveDecor side="left" opacity={0.4} />
                <WaveDecor side="right" top="20%" opacity={0.3} color="#a855f7" />

                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="page-header"
                    >
                        <h1 className="page-title">Стать <span className="gradient-text">Участником</span></h1>
                        <p className="page-desc">
                            Присоединяйтесь к экосистеме лидеров, определяющих будущее искусственного интеллекта в Узбекистане.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-header center mb-12"
                    >
                        <h2 className="section-title text-center">Преимущества членства</h2>
                    </motion.div>

                    <div className="benefits-grid">
                        {benefits.map((b, i) => (
                            <motion.div
                                key={i}
                                className="benefit-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="benefit-icon-wrapper">{b.icon}</div>
                                <div className="benefit-content">
                                    <h3>{b.title}</h3>
                                    <p>{b.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Join Section */}
            <section className="how-to-join">
                <div className="container steps-container">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Как вступить в Альянс?</h2>
                    </div>

                    <div className="steps-timeline">
                        <div className="steps-line"></div>

                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h4 className="step-title">Подача заявки</h4>
                                <p className="step-desc">Заполните официальную форму на сайте, указав информацию о вашей организации и целях вступления.</p>
                            </div>
                        </div>

                        <div className="step-item even">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h4 className="step-title">Квалификация</h4>
                                <p className="step-desc">Экспертный совет рассматривает заявку и проводит собеседование для подтверждения соответствия критериям.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h4 className="step-title">Меморандум</h4>
                                <p className="step-desc">Подписание меморандума о присоединении и получение официального сертификата участника Альянса.</p>
                            </div>
                        </div>
                    </div>

                    <div className="join-cta">
                        <motion.button
                            className="primary-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Подать заявку сейчас
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Participants;
