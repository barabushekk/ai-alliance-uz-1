import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Globe, Users, Building2, GraduationCap } from 'lucide-react';
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

    const participationTypes = [
        {
            title: 'Бизнес',
            icon: <Building2 size={32} />,
            benefits: [
                'Доступ к платформе тестирования ИИ-моделей',
                'Участие в формировании отраслевых стандартов',
                'Приоритетный подбор ИТ-кадров'
            ]
        },
        {
            title: 'Образование и Наука',
            icon: <GraduationCap size={32} />,
            benefits: [
                'Гранты на исследовательские ИИ-проекты',
                'Доступ к закрытым датасетам для обучения',
                'Совместные лаборатории с тех-гигантами'
            ]
        },
        {
            title: 'Гос. сектор',
            icon: <Globe size={32} />,
            benefits: [
                'Экспертиза проектов цифровой трансформации',
                'Подготовка кадров для госслужбы',
                'Разработка этических норм применения ИИ'
            ]
        }
    ];

    const requirements = [
        { title: 'Документация', items: ['Выписка из ЕГРПО', 'Презентация деятельности', 'Устав (копия)'] },
        { title: 'Обязательства', items: ['Участие в рабочих группах', 'Соблюдение Кодекса этики ИИ', 'Ежегодный отчет'] },
        { title: 'Взносы', items: ['Вступительный взнос', 'Членский взнос (ежегодно)', 'Размер зависит от типа орг-ии'] }
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

            {/* Participation Types Section */}
            <section className="section-padding bg-light">
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="section-tag">ФОРМАТЫ</span>
                        <h2 className="clean-heading">Типы участия</h2>
                        <p className="clean-text mx-auto">Выберите подходящий формат взаимодействия с Альянсом</p>
                    </div>

                    <div className="types-grid-premium">
                        {participationTypes.map((type, i) => (
                            <motion.div
                                key={i}
                                className="type-card-premium"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="type-icon-box">{type.icon}</div>
                                <h3 className="type-title-premium">{type.title}</h3>
                                <ul className="type-benefits-premium">
                                    {type.benefits.map((item, idx) => (
                                        <li key={idx}>
                                            <CheckCircle size={18} className="check-icon-premium" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements & Info Section */}
            <section className="section-padding">
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="section-tag">КРИТЕРИИ</span>
                        <h2 className="clean-heading">Условия и требования</h2>
                    </div>

                    <div className="requirements-grid-premium">
                        {requirements.map((req, i) => (
                            <motion.div
                                key={i}
                                className="req-card-premium"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="req-header">
                                    <div className="req-number">0{i + 1}</div>
                                    <h4>{req.title}</h4>
                                </div>
                                <ul className="req-list-premium">
                                    {req.items.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
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
                            Заполнить анкету участника
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Participants;
