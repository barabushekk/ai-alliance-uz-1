import React from 'react';
import { Instagram, Send, Linkedin, Mail, MapPin } from 'lucide-react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import logoLight from '../assets/logo-light.png';

const Footer = () => {
    const { t, i18n } = useTranslation();
    const [navLinks, setNavLinks] = React.useState([]);

    React.useEffect(() => {
        fetchNavLinks();
    }, [i18n.language]);

    const fetchNavLinks = async () => {
        try {
            const { data, error } = await supabase
                .from('site_pages')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (error) throw error;
            if (data) {
                setNavLinks(data.map(page => ({
                    title: t(`nav.${page.key}`),
                    path: page.path
                })));
            }
        } catch (err) {
            console.error('Error fetching footer links:', err);
        }
    };

    // Split links into two columns for the footer
    const leftCol = navLinks.slice(0, Math.ceil(navLinks.length / 2));
    const rightCol = navLinks.slice(Math.ceil(navLinks.length / 2));

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
