import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Database, Globe, Lightbulb, BookOpen, Shield, Cpu, Network } from 'lucide-react';
import Hero from '../components/Hero';
import WaveDecor from '../components/WaveDecor';
import './Home.css';
import { Link } from 'react-router-dom';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

const Home = () => {
    return (
        <div className="home-page" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Decor - Alive & Aesthetic */}
            <WaveDecor side="left" top="-10%" color="#349CD6" opacity={0.4} />
            <WaveDecor side="right" top="20%" color="#3D51A0" opacity={0.3} />

            <WaveDecor side="left" top="50%" color="#3D51A0" opacity={0.25} />
            <WaveDecor side="right" top="80%" color="#C850C0" opacity={0.3} />

            <Hero />

            {/* About Section */}
            <section className="section-padding">
                <div className="container">
                    <div className="clean-about-layout">
                        <motion.div
                            className="about-content-left"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="section-tag">О НАС</div>
                            <h2 className="clean-heading">
                                Интеллектуальный потенциал <br />
                                <span className="text-highlight">цифровой экономики</span>
                            </h2>
                            <p className="clean-text" style={{ marginBottom: '40px' }}>
                                Альянс объединяет ведущие технологические компании для развития рынка ИИ в Узбекистане.
                                Мы создаем среду для инноваций, объединяя ресурсы бизнеса и науку.
                            </p>

                            <Link to="/about" className="btn-clean-primary">
                                Узнать больше
                            </Link>
                        </motion.div>

                        <div className="about-visual-right">
                            <div className="abstract-card-stack">
                                <div className="metric-card mc-1">
                                    <div className="mc-icon"><Cpu size={20} /></div>
                                    <div className="mc-info">
                                        <span className="mc-val">94%</span>
                                        <span className="mc-lbl">Эффективность</span>
                                    </div>
                                </div>
                                <div className="metric-card mc-2">
                                    <div className="mc-icon"><Network size={20} /></div>
                                    <div className="mc-info">
                                        <span className="mc-val">15+</span>
                                        <span className="mc-lbl">Проектов</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="section-padding bg-light">
                <div className="container">
                    <div className="flex-header">
                        <div>
                            <div className="section-tag">ИНИЦИАТИВЫ</div>
                            <h2 className="clean-heading">Ключевые проекты</h2>
                        </div>
                        <Link to="/projects" className="link-u">Все проекты <ArrowRight size={16} /></Link>
                    </div>

                    <div className="projects-grid-3col">
                        {[
                            { title: "Uzbek LLM", desc: "Национальная языковая модель для сохранения культурного наследия.", icon: <Globe /> },
                            { title: "AI Education Hub", desc: "Подготовка 10,000 специалистов к 2027 году.", icon: <BookOpen /> },
                            { title: "GovTech AI", desc: "Внедрение ИИ-решений в государственные услуги.", icon: <Shield /> }
                        ].map((p, i) => (
                            <motion.div
                                key={i}
                                className="project-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <span className="proj-status">Активен</span>
                                <div className="proj-icon-box">{p.icon}</div>
                                <h3>{p.title}</h3>
                                <p>{p.desc}</p>
                                <div className="proj-footer">
                                    <span className="link-text">Подробнее</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Working Groups - Light Unified Theme */}
            <section className="wg-section-light">
                <div className="container">
                    <div className="wg-layout">
                        <div className="wg-left-content">
                            <span className="section-tag">РАБОЧИЕ ГРУППЫ</span>
                            <h2>Экспертиза и стандарты</h2>
                            <p>
                                Мы разрабатываем фундамент для безопасного и этичного ИИ.
                                Эксперты из ведущих компаний формируют повестку дня.
                            </p>
                        </div>

                        <div className="wg-list">
                            {[
                                { title: "Этика и регулирование", desc: "Разработка кодекса этики ИИ", icon: <Lightbulb /> },
                                { title: "Инфраструктура и данные", desc: "Доступ к вычислительным мощностям", icon: <Database /> },
                                { title: "Образование и кадры", desc: "Стандарты подготовки специалистов", icon: <BookOpen /> }
                            ].map((wg, i) => (
                                <div key={i} className="wg-item-row">
                                    <div className="wg-icon">{wg.icon}</div>
                                    <div className="wg-text">
                                        <h4>{wg.title}</h4>
                                        <p>{wg.desc}</p>
                                    </div>
                                    <ArrowRight size={16} color="#cbd5e1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Blue Feature Section: Role of AI */}
            <section className="container">
                <div className="section-blue">
                    {/* Decorative Wave SVG */}
                    <svg className="wave-deco" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" stroke="#3b82f6" strokeWidth="2" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,192C1248,224,1344,224,1392,224L1440,224" opacity="0.3"></path>
                    </svg>

                    <div className="feature-layout">
                        <div className="feature-left">
                            <h2>
                                Роль технологий ИИ <br />
                                в развитии компании сегодня
                            </h2>
                            <p>
                                Технологии ИИ существенно трансформируют деятельность компаний и станут главным трендом на рынке в течение десяти лет.
                            </p>
                            <div style={{ marginTop: '40px' }}>
                                <div className="section-tag">ОПЫТ ПРИМЕНЕНИЯ</div>
                                <p style={{ fontSize: '14px', maxWidth: '400px' }}>
                                    Альянс создал и активно развивает проект AI Russia, цель которого – продемонстрировать бизнес-сообществу работающие кейсы с использованием искусственного интеллекта.
                                </p>
                            </div>
                        </div>
                        <div className="feature-right">
                            <div className="section-tag" style={{ marginBottom: '24px' }}>Ключевые преимущества</div>
                            <div className="feature-list">
                                {[
                                    "Автоматизация бизнес-процессов повышает продуктивность.",
                                    "Анализ данных дает лучшее понимание собственных производственных связей и потребностей клиентов.",
                                    "Доступные, персонализированные и оснащённые ИИ продукты и сервисы повышают спрос.",
                                    "Использование и развитие ИИ повышает инвестиционную привлекательность бизнеса."
                                ].map((item, i) => (
                                    <div key={i} className="feature-item">
                                        <span className="feature-dash">—</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                            <p style={{ marginTop: '24px', fontStyle: 'italic', color: '#666', fontSize: '14px' }}>
                                Эти факторы помогают компаниям стать лидерами в своих отраслях и увеличить долю на рынке.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners & Mission Section */}
            <section className="section-padding">
                <div className="container">

                    {/* Partners Card Style */}
                    <div className="partners-card">
                        <div className="partners-unified-grid">
                            {[
                                "Yandex", "Sber AI", "UzTelecom", "IT Park", "Inha Univ.",
                                "TBC Bank", "Click", "Payme", "Beeline", "Ucell",
                                "Uralchem", "SibUr", "Severstal", "T-Bank", "Kaspersky"
                            ].map((name, i) => (
                                <div key={i} className="partner-logo-plain">
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mission Split Text */}
                    <div className="mission-split">
                        <div className="mission-col">
                            <h4>Миссия</h4>
                            <p>
                                Быть центром развития искусственного интеллекта в регионе и обеспечивать технологическое лидерство нашей страны и компаний-участников Альянса на глобальном технологическом рынке.
                            </p>
                        </div>
                        <div className="mission-col">
                            <h4>Альянс — открытая структура</h4>
                            <p>
                                Для развития искусственного интеллекта необходимо объединять усилия компаний-лидеров в этой сфере. Мы создаем платформу для обмена опытом и совместных проектов.
                            </p>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '80px', marginBottom: '80px' }}>
                        <Link to="/partners" className="btn-clean-outline">Стать участником</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
