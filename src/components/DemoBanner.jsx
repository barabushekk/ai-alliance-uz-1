import React, { useEffect, useState } from 'react';
import './DemoBanner.css';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const DemoBanner = () => {
    const { i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('home_sections')
                    .select('is_active')
                    .eq('key', 'demo_banner')
                    .single();

                if (data) {
                    setIsVisible(data.is_active);
                    // Set variable for other components (like Navbar)
                    if (data.is_active) {
                        document.documentElement.style.setProperty('--banner-height', window.innerWidth <= 768 ? '44px' : '32px');
                    } else {
                        document.documentElement.style.setProperty('--banner-height', '0px');
                    }
                }
            } catch (err) {
                console.error("Banner status fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();

        const handleResize = () => {
            if (isVisible) {
                document.documentElement.style.setProperty('--banner-height', window.innerWidth <= 768 ? '44px' : '32px');
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isVisible]);

    if (loading || !isVisible) return null;

    const messages = {
        en: "The site is running in test mode",
        ru: "Сайт запущен в тестовом режиме",
        uz: "Sayt test rejimida ishga tushirildi"
    };

    const currentMessage = messages[i18n.language] || messages.ru;

    return (
        <div className="demo-banner">
            <div className="demo-banner-content">
                <Info size={14} className="demo-icon" />
                <span>{currentMessage}</span>
            </div>
            <div className="demo-banner-blur"></div>
        </div>
    );
};

export default DemoBanner;
