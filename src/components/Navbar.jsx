import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

import logo from '../assets/logo.png';
import logoLight from '../assets/logo-light.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const location = useLocation();

  /* Scroll & Data Detection */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    fetchNavLinks();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchNavLinks = async () => {
    try {
      const { data, error } = await supabase.from('site_pages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedLinks = data.map(page => ({
          title: t(`nav.${page.key}`),
          path: page.path,
          key: page.key
        }));
        setNavLinks(formattedLinks);
      }
    } catch (err) {
      console.error('Error fetching nav links:', err);
      // Fallback in case of error
      setNavLinks([
        { title: t('nav.home'), path: '/' },
        { title: t('nav.about'), path: '/about' }
      ]);
    }
  };

  /* Listen for language changes to update titles */
  useEffect(() => {
    fetchNavLinks();
  }, [i18n.language]);

  /* Lock Body Scroll when Menu Open */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container nav-container">
          <Link to="/" className="navbar-logo">
            <img
              src={isScrolled ? logo : logoLight}
              alt="AI Alliance"
              className="nav-logo-img"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="nav-menu desktop-only">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="nav-right desktop-only">
            <LanguageSwitcher isDark={!isScrolled} />
          </div>

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} color={isScrolled ? "#0f172a" : "#ffffff"} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Sidebar & Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="mobile-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="sidebar-header">
                <span className="sidebar-title">{t('nav.home')}</span>
                <button
                  className="close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="sidebar-links">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`sidebar-item ${location.pathname === link.path ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="sidebar-footer">
                <div className="flex justify-center w-full">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
