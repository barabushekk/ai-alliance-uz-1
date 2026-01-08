import React from 'react';
import { motion } from 'framer-motion';
import { Scale, GraduationCap, Microscope, Database, Users, Target, Calendar, TrendingUp } from 'lucide-react';
import './Groups.css';

// Import generated images
import ethicsImg from '../assets/group_ethics_regulation_1767869292682.png';
import educationImg from '../assets/group_education_talent_1767869308153.png';
import researchImg from '../assets/group_research_development_1767869321603.png';
import infrastructureImg from '../assets/group_infrastructure_data_1767869336182.png';

const Groups = () => {
    const workingGroups = [
        {
            name: 'Этика и Регулирование',
            icon: <Scale size={32} />,
            leads: 'IT Park, Министерство Цифровых Технологий',
            focus: 'Разработка этических кодексов и правовых рамок для ответственного использования искусственного интеллекта в Узбекистане.',
            objectives: [
                'Создание национальных стандартов этики ИИ',
                'Разработка нормативно-правовой базы',
                'Защита прав граждан в эпоху ИИ'
            ],
            members: '12 экспертов',
            meetings: 'Ежемесячно',
            image: ethicsImg
        },
        {
            name: 'Образование и Кадры',
            icon: <GraduationCap size={32} />,
            leads: 'Inha University, Amity University',
            focus: 'Подготовка комплексных учебных программ и сертификация специалистов в области Data Science и Machine Learning.',
            objectives: [
                'Разработка образовательных стандартов',
                'Создание программ сертификации',
                'Подготовка преподавателей ИИ'
            ],
            members: '18 преподавателей',
            meetings: 'Раз в 2 недели',
            image: educationImg
        },
        {
            name: 'Наука и R&D',
            icon: <Microscope size={32} />,
            leads: 'Академия Наук Узбекистана, TUIT',
            focus: 'Поддержка фундаментальных исследований в области ИИ и обеспечение трансфера технологий в реальный сектор экономики.',
            objectives: [
                'Координация научных исследований',
                'Грантовая поддержка проектов',
                'Коммерциализация разработок'
            ],
            members: '25 исследователей',
            meetings: 'Ежемесячно',
            image: researchImg
        },
        {
            name: 'Инфраструктура и Данные',
            icon: <Database size={32} />,
            leads: 'Uztelecom, Ucell',
            focus: 'Создание общедоступных датасетов и облачных вычислительных хабов для развития ИИ-индустрии в стране.',
            objectives: [
                'Построение национальной дата-инфраструктуры',
                'Создание открытых датасетов',
                'Развертывание вычислительных кластеров'
            ],
            members: '15 специалистов',
            meetings: 'Еженедельно',
            image: infrastructureImg
        }
    ];

    const stats = [
        { value: '4', label: 'Рабочие группы', icon: <Users size={24} /> },
        { value: '70+', label: 'Активных экспертов', icon: <Target size={24} /> },
        { value: '15+', label: 'Инициатив в работе', icon: <TrendingUp size={24} /> },
        { value: '2024', label: 'Год основания', icon: <Calendar size={24} /> }
    ];

    return (
        <div className="page-standard groups-page">
            {/* Hero Section */}
            <section className="page-hero hero-groups">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="page-header"
                    >
                        <h1 className="page-title">
                            Рабочие <span className="gradient-text">Группы</span>
                        </h1>
                        <p className="page-desc">
                            Экспертные центры компетенций, решающие ключевые задачи развития ИИ-экосистемы Узбекистана.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="groups-stats-section">
                <div className="container">
                    <div className="stats-grid-groups">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="stat-card-group"
                            >
                                <div className="stat-icon">{stat.icon}</div>
                                <h3 className="stat-value">{stat.value}</h3>
                                <p className="stat-label">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Working Groups Section */}
            <section className="working-groups-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Направления работы</h2>
                        <p className="section-subtitle">Четыре ключевых направления развития ИИ-экосистемы</p>
                    </div>

                    <div className="groups-list">
                        {workingGroups.map((group, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="group-card-featured"
                            >
                                <div className="group-image-wrapper">
                                    <img src={group.image} alt={group.name} className="group-image" />
                                    <div className="group-icon-overlay">
                                        {group.icon}
                                    </div>
                                </div>

                                <div className="group-content">
                                    <h3 className="group-title">{group.name}</h3>

                                    <div className="group-leads">
                                        <span className="leads-label">Руководители:</span>
                                        <span className="leads-text">{group.leads}</span>
                                    </div>

                                    <p className="group-focus">{group.focus}</p>

                                    <div className="group-objectives">
                                        <h4 className="objectives-title">Ключевые задачи:</h4>
                                        <ul className="objectives-list">
                                            {group.objectives.map((obj, idx) => (
                                                <li key={idx}>{obj}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="group-meta">
                                        <div className="meta-item">
                                            <Users size={18} />
                                            <span>{group.members}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Calendar size={18} />
                                            <span>Встречи: {group.meetings}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="groups-cta-section">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Users className="cta-icon" size={48} />
                        <h2 className="cta-title">Присоединяйтесь к рабочим группам</h2>
                        <p className="cta-description">
                            Мы приглашаем экспертов, исследователей и практиков для участия в работе групп. Внесите свой вклад в развитие ИИ-экосистемы Узбекистана.
                        </p>
                        <button className="primary-btn">Подать заявку на участие</button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Groups;
