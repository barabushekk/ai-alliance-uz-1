import React from 'react';
import { Instagram, Send, Linkedin, Mail, MapPin } from 'lucide-react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoLight from '../assets/logo-light.png';

const Footer = () => {
    const { t } = useTranslation();

    const navLinks = [
        { title: t('nav.home'), path: '/' },
        { title: t('nav.about'), path: '/about' },
        { title: t('nav.participants'), path: '/participants' },
        { title: t('nav.partners'), path: '/partners' },
        { title: t('nav.projects'), path: '/projects' },
        { title: t('nav.groups'), path: '/groups' },
        { title: t('nav.knowledge'), path: '/knowledge' },
        { title: t('nav.news'), path: '/news' },
    ];

    // Split links into two columns for the footer
    const leftCol = navLinks.slice(0, 4);
    const rightCol = navLinks.slice(4);

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src={logoLight} alt="AI Alliance" className="footer-logo-img" />
                        </Link>

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
                            <h4>{t('footer.navigation', 'Навигация')}</h4>
                            <ul>
                                {leftCol.map(link => (
                                    <li key={link.path}>
                                        <Link to={link.path}>{link.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="nav-col">
                            <h4>{t('footer.resources', 'Ресурсы')}</h4>
                            <ul>
                                {rightCol.map(link => (
                                    <li key={link.path}>
                                        <Link to={link.path}>{link.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="footer-contact">
                        <h4>{t('footer.contacts', 'Контакты')}</h4>
                        <div className="contact-row">
                            <Mail size={18} className="contact-icon" />
                            <a href="mailto:info@ai-alliance.uz">info@ai-alliance.uz</a>
                        </div>
                        <div className="contact-row">
                            <MapPin size={18} className="contact-icon" />
                            <span>{t('footer.address', 'Ташкент, Узбекистан')}</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} AI Alliance Uzbekistan. {t('footer.rights', 'Все права защищены.')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
