import React from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="hero-video"
            >
                <source src="/hero-background.mp4" type="video/mp4" />
            </video>
            <div className="container">
                <div className="hero-row">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-left"
                    >
                        <h1 className="hero-title">
                            Альянс в сфере <br />
                            искусственного <br />
                            интеллекта
                        </h1>
                        <p className="hero-desc">
                            Мы объединяем технологические компании для развития рынка ИИ,
                            совершенствования законодательной базы и подготовки кадров.
                        </p>
                    </motion.div>

                    {/* Right Column - Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="hero-right"
                    >
                        <motion.div
                            className="hero-card"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div>
                                <div className="card-label">Документ</div>
                                <h3 className="card-title">
                                    Национальная стратегия развития ИИ до 2030 года
                                </h3>
                                <p className="card-text">
                                    Ключевые показатели и дорожная карта внедрения технологий в экономику.
                                </p>
                            </div>
                            <button className="btn-download">
                                <Download size={14} /> Скачать PDF
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hero-footer"
                >
                    <div className="footer-content">
                        <span className="footer-title">Исследование 2025:</span>
                        <span className="footer-desc">Тренды генеративных моделей в Центральной Азии</span>
                    </div>
                    <button className="btn-arrow">
                        <ArrowRight size={16} />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
