import React from 'react';
import { Instagram, Send, Linkedin, Mail, MapPin } from 'lucide-react';
import './Footer.css';
import { Link } from 'react-router-dom';
import logoLight from '../assets/logo-light.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src={logoLight} alt="AI Alliance" className="footer-logo-img" />
                        </Link>
                        <p className="footer-desc">
                            Развитие экосистемы искусственного интеллекта в Узбекистане.
                            Объединяем государство, науку и бизнес для технологического будущего.
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="Telegram" className="social-item">
                                <Send size={20} />
                            </a>
                            <a href="#" aria-label="Instagram" className="social-item">
                                <Instagram size={20} />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="social-item">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-nav">
                        <div className="nav-col">
                            <h4>О Нас</h4>
                            <ul>
                                <li><Link to="/about">Миссия</Link></li>
                                <li><Link to="/structure">Структура</Link></li>
                                <li><Link to="/partners">Партнеры</Link></li>
                            </ul>
                        </div>
                        <div className="nav-col">
                            <h4>Ресурсы</h4>
                            <ul>
                                <li><Link to="/projects">Проекты</Link></li>
                                <li><Link to="/knowledge">База знаний</Link></li>
                                <li><Link to="/news">Новости</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-contact">
                        <h4>Контакты</h4>
                        <div className="contact-row">
                            <Mail size={18} className="contact-icon" />
                            <a href="mailto:info@ai-alliance.uz">info@ai-alliance.uz</a>
                        </div>
                        <div className="contact-row">
                            <MapPin size={18} className="contact-icon" />
                            <span>Ташкент, Узбекистан</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} AI Alliance Uzbekistan. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
