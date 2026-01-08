import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Network, Handshake, Users, Zap } from 'lucide-react';
import './Partners.css';

const Partners = () => {
    const strategicPartners = [
        {
            name: 'Uztelecom',
            category: 'Государственные компании',
            role: 'Технологическая инфраструктура',
            description: 'Обеспечение высокоскоростной передачи данных и облачных вычислений для ИИ-проектов национального масштаба.',
            logo: 'UT'
        },
        {
            name: 'EPAM Uzbekistan',
            category: 'Технологические гиганты',
            role: 'Инженерная экспертиза',
            description: 'Поддержка в разработке сложных программных решений и обучение высококвалифицированных ИТ-специалистов.',
            logo: 'EP'
        },
        {
            name: 'Ucell',
            category: 'Телекоммуникации',
            role: 'Мобильные инновации',
            description: 'Внедрение 5G технологий и развитие сервисов на базе искусственного интеллекта.',
            logo: 'UC'
        },
    ];

    const partnerCategories = [
        {
            title: 'Образование и Наука',
            icon: <GraduationCap size={32} />,
            partners: [
                { name: 'Inha University', location: 'Ташкент' },
                { name: 'Amity University', location: 'Ташкент' },
                { name: 'WIUT', location: 'Ташкент' },
                { name: 'TUIT', location: 'Ташкент' },
            ]
        },
        {
            title: 'Технологические парки',
            icon: <Network size={32} />,
            partners: [
                { name: 'IT Park Uzbekistan', location: 'Национальный охват' },
                { name: 'Astrum Academy', location: 'Ташкентская область' },
                { name: 'Digital City', location: 'Андижан' },
            ]
        },
        {
            title: 'Государственный сектор',
            icon: <Building2 size={32} />,
            partners: [
                { name: 'Министерство Цифровых Технологий', location: 'Узбекистан' },
                { name: 'Центр ИИ (Digital Uzbekistan)', location: 'Ташкент' },
            ]
        }
    ];

    const benefits = [
        {
            icon: <Handshake size={40} />,
            title: 'Совместные исследования',
            description: 'Доступ к научно-исследовательским работам и участие в создании новых продуктов на базе ИИ.'
        },
        {
            icon: <Zap size={40} />,
            title: 'Инфраструктура',
            description: 'Приоритетный доступ к государственным дата-сетам и вычислительным кластерам.'
        },
        {
            icon: <Users size={40} />,
            title: 'Экспертное сообщество',
            description: 'Участие в закрытых мероприятиях, форумах и рабочих группах по развитию ИИ.'
        }
    ];

    return (
        <div className="page-standard partners-page">
            {/* Hero Section */}
            <section className="page-hero hero-partners">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="page-header"
                    >
                        <h1 className="page-title">
                            Партнеры и <span className="gradient-text">Участники</span>
                        </h1>
                        <p className="page-desc">
                            Сообщество лидеров, формирующих цифровой суверенитет Узбекистана через развитие экосистемы искусственного интеллекта.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Strategic Partners Section */}
            <section className="strategic-partners-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Стратегические партнеры</h2>
                        <p className="section-subtitle">Ключевые организации, обеспечивающие технологическую основу Альянса</p>
                    </div>

                    <div className="strategic-grid">
                        {strategicPartners.map((partner, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="strategic-card"
                            >
                                <div className="partner-logo">{partner.logo}</div>
                                <div className="partner-content">
                                    <span className="partner-category">{partner.category}</span>
                                    <h3 className="partner-name">{partner.name}</h3>
                                    <h4 className="partner-role">{partner.role}</h4>
                                    <p className="partner-description">{partner.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Экосистема Альянса</h2>
                        <p className="section-subtitle">Партнеры по направлениям деятельности</p>
                    </div>

                    <div className="categories-grid">
                        {partnerCategories.map((category, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="category-card"
                            >
                                <div className="category-icon">{category.icon}</div>
                                <h3 className="category-title">{category.title}</h3>
                                <div className="partners-list">
                                    {category.partners.map((p, idx) => (
                                        <div key={idx} className="partner-item">
                                            <span className="partner-item-name">{p.name}</span>
                                            <span className="partner-item-location">{p.location}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Преимущества партнерства</h2>
                        <p className="section-subtitle">Что получают участники Альянса</p>
                    </div>

                    <div className="benefits-grid">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="benefit-card"
                            >
                                <div className="benefit-icon">{benefit.icon}</div>
                                <h3 className="benefit-title">{benefit.title}</h3>
                                <p className="benefit-description">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="cta-title">Станьте частью Альянса</h2>
                        <p className="cta-description">
                            Мы открыты для новых партнерств с инновационными компаниями, исследовательскими центрами и образовательными учреждениями.
                        </p>
                        <button className="primary-btn">Подать заявку на вступление</button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Partners;
