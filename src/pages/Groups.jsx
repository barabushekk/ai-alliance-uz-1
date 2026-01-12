import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, Users, Calendar } from 'lucide-react';
import DynamicIcon from '../components/DynamicIcon';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import ApplicationModal from '../components/ApplicationModal';
import './Groups.css';

const Groups = () => {
    const { i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState({
        hero: { title: 'Комитеты', description: 'Постоянно действующие отраслевые комитеты...' },
        header: { title: 'Направления работы', description: 'Ключевые направления...' },
        cta: { title: 'Присоединяйтесь к комитетам', description: '', cta_text: 'Подать заявку', cta_link: '#' }
    });
    const [items, setItems] = useState({
        stats: [],
        groups: []
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [
                { data: sData },
                { data: stData },
                { data: gData }
            ] = await Promise.all([
                supabase.from('groups_sections').select('*'),
                supabase.from('groups_stats').select('*').order('sort_order', { ascending: true }),
                supabase.from('groups_items').select('*').order('sort_order', { ascending: true })
            ]);

            if (sData) {
                const newSections = { ...sections };
                sData.forEach(s => newSections[s.key] = s);
                setSections(newSections);
            }

            setItems({
                stats: stData || [],
                groups: gData || []
            });
        } catch (error) {
            console.error('Error fetching groups data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLocalized = (item, field) => {
        if (!item) return '';
        const lang = i18n.language;
        if (lang === 'ru') return item[field] || '';
        return item[`${field}_${lang}`] || item[field] || '';
    };



    if (loading) return <div className="page-standard"><div className="loading-container fixed-loader"><div className="loader-aesthetic"></div></div></div>;

    return (
        <div className="page-standard groups-page">
            <section className="page-hero hero-groups">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                        <h1 className="page-title">
                            <span className="gradient-text">{getLocalized(sections.hero, 'title')}</span>
                        </h1>
                        <p className="page-desc">{getLocalized(sections.hero, 'description')}</p>
                    </motion.div>
                </div>
            </section>

            <section className="groups-stats-section">
                <div className="container">
                    <div className="stats-grid-groups">
                        {items.stats.map((stat, i) => (
                            <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="stat-card-group">
                                <div className="stat-icon"><DynamicIcon name={stat.icon_name} size={24} /></div>
                                <h3 className="stat-value">{stat.value}</h3>
                                <p className="stat-label">{getLocalized(stat, 'label')}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="working-groups-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{getLocalized(sections.header, 'title')}</h2>
                        <p className="section-subtitle">{getLocalized(sections.header, 'description')}</p>
                    </div>

                    <div className="groups-list">
                        {items.groups.map((group, i) => (
                            <motion.div key={group.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="group-card-featured">
                                <div className="group-image-wrapper">
                                    <img src={group.image_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80'} alt={getLocalized(group, 'name')} className="group-image" />
                                    <div className="group-icon-overlay">
                                        <DynamicIcon name={group.icon_name || (['Scale', 'GraduationCap', 'Microscope', 'Database'][i % 4])} size={32} />
                                    </div>
                                </div>

                                <div className="group-content">
                                    <h3 className="group-title">{getLocalized(group, 'name')}</h3>
                                    <div className="group-leads">
                                        <span className="leads-label">{i18n.language === 'ru' ? 'Руководители' : (i18n.language === 'uz' ? 'Raxbarlar' : 'Leads')}:</span>
                                        <span className="leads-text">{getLocalized(group, 'leads')}</span>
                                    </div>
                                    <p className="group-focus">{getLocalized(group, 'focus')}</p>

                                    {getLocalized(group, 'objectives') && (
                                        <div className="group-objectives">
                                            <h4 className="objectives-title">{i18n.language === 'ru' ? 'Ключевые задачи' : (i18n.language === 'uz' ? 'Asosiy vazifalar' : 'Key Objectives')}:</h4>
                                            <ul className="objectives-list">
                                                {getLocalized(group, 'objectives').split('\n').filter(line => line.trim()).map((obj, idx) => (
                                                    <li key={idx}>{obj}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="group-meta">
                                        <div className="meta-item"><Users size={18} /><span>{getLocalized(group, 'members')}</span></div>
                                        <div className="meta-item"><Calendar size={18} /><span>{getLocalized(group, 'meetings')}</span></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="groups-cta-section">
                <div className="container">
                    <motion.div className="cta-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Users className="cta-icon" size={48} />
                        <h2 className="cta-title">{getLocalized(sections.cta, 'title')}</h2>
                        <p className="cta-description">{getLocalized(sections.cta, 'description')}</p>
                        <motion.button
                            className="primary-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                        >
                            {getLocalized(sections.cta, 'cta_text') || 'Подать заявку'}
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type="committee"
            />
        </div>
    );
};

export default Groups;

