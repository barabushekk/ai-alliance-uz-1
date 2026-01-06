import React from 'react';
import { motion } from 'framer-motion';
import { Users, Code, Scale, Microscope } from 'lucide-react';
import './Groups.css';

const Groups = () => {
    const groups = [
        { name: 'Этика и Регулирование', icon: <Scale />, leads: 'IT Park, Минцифры', focus: 'Разработка этических кодексов и правовых рамок для ИИ.' },
        { name: 'Образование и Кадры', icon: <Code />, leads: 'Inha University, Amity', focus: 'Подготовка учебных программ и сертификация специалистов.' },
        { name: 'Наука и R&D', icon: <Microscope />, leads: 'Академия Наук, TUIT', focus: 'Поддержка фундаментальных исследований и трансфер технологий.' },
        { name: 'Инфраструктура и Данные', icon: <Users />, leads: 'Uztelecom, Ucell', focus: 'Создание общих датасетов и облачных вычислительных хабов.' },
    ];

    return (
        <div className="page-standard groups-page">
            <section className="page-hero hero-groups">
                <div className="container">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-header">
                        <h1 className="page-title">Рабочие <span className="gradient-text">Группы</span></h1>
                        <p className="page-desc">Экспертные центры, решающие конкретные задачи отрасли.</p>
                    </motion.div>
                </div>
            </section>

            <div className="container">

                <div className="groups-grid">
                    {groups.map((g, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group-card"
                        >
                            <div className="group-header">
                                <div className="group-icon">{g.icon}</div>
                                <h3>{g.name}</h3>
                            </div>
                            <div className="group-body">
                                <p><strong>Кто ведет:</strong> {g.leads}</p>
                                <p className="mt-1">{g.focus}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Groups;
