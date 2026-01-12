import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, Tag, ArrowLeft, Share2,
    ChevronLeft, ChevronRight, Maximize2, X
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import './NewsDetail.css';

const NewsDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchNews();
    }, [slug]);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('news_items')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !data) {
                // If not found by slug, try by ID
                const { data: idData, error: idError } = await supabase
                    .from('news_items')
                    .select('*')
                    .eq('id', slug)
                    .single();

                if (idError) throw idError;
                setNews(idData);
            } else {
                setNews(data);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            navigate('/news');
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

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: getLocalized(news, 'title'),
                url: window.location.href
            });
        }
    };

    if (loading) return <div className="loading-container fixed-loader"><div className="loader-aesthetic"></div></div>;
    if (!news) return null;

    const gallery = Array.isArray(news.gallery) ? news.gallery : [];

    return (
        <div className="news-detail-page">
            <section className="detail-hero">
                <div className="hero-bg" style={{ backgroundImage: `url(${news.image_url})` }}></div>
                <div className="hero-overlay"></div>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-content"
                    >
                        <Link to="/news" className="back-link">
                            <ArrowLeft size={20} />
                            {i18n.language === 'en' ? 'Back to News' : (i18n.language === 'uz' ? 'Yangiliklarga qaytish' : 'Назад к новостям')}
                        </Link>

                        <div className="detail-meta">
                            <span className="meta-tag">
                                <Tag size={16} />
                                {getLocalized(news, 'category')}
                            </span>
                            <span className="meta-item">
                                <Calendar size={16} />
                                {getLocalized(news, 'date')}
                            </span>
                        </div>

                        <h1 className="detail-title">{getLocalized(news, 'title')}</h1>
                        <p className="detail-excerpt">{getLocalized(news, 'excerpt')}</p>
                    </motion.div>
                </div>
            </section>

            <section className="detail-body">
                <div className="container">
                    <div className="detail-grid">
                        <div className="main-content">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="content-text"
                            >
                                {(() => {
                                    const paragraphs = getLocalized(news, 'description').split('\n').filter(p => p.trim());
                                    const galleryItems = Array.isArray(news.gallery) ? news.gallery : [];
                                    const elements = [];
                                    let galleryIndex = 0;

                                    paragraphs.forEach((para, idx) => {
                                        elements.push(<p key={`p-${idx}`}>{para}</p>);

                                        // Logical distribution: After 1st paragraph, then every 2 paragraphs
                                        const shouldInsertImage = (idx === 0 && paragraphs.length > 1) || (idx > 0 && (idx + 1) % 2 === 0);

                                        if (shouldInsertImage && galleryIndex < galleryItems.length) {
                                            elements.push(
                                                <motion.div
                                                    key={`img-${galleryIndex}`}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    className="interleaved-image-wrapper"
                                                    onClick={() => setSelectedImage(galleryItems[galleryIndex])}
                                                >
                                                    <img src={galleryItems[galleryIndex]} alt={`Gallery ${galleryIndex}`} className="interleaved-image" />
                                                    <div className="image-expand-hint">
                                                        <Maximize2 size={14} />
                                                        {i18n.language === 'en' ? 'Click to enlarge' : (i18n.language === 'uz' ? 'Kengaytirish uchun bosing' : 'Нажмите для увеличения')}
                                                    </div>
                                                </motion.div>
                                            );
                                            galleryIndex++;
                                        }
                                    });

                                    // Append remaining images if more images than paragraph slots
                                    while (galleryIndex < galleryItems.length) {
                                        elements.push(
                                            <div key={`img-tail-${galleryIndex}`} className="interleaved-image-wrapper" onClick={() => setSelectedImage(galleryItems[galleryIndex])}>
                                                <img src={galleryItems[galleryIndex]} alt="" className="interleaved-image" />
                                            </div>
                                        );
                                        galleryIndex++;
                                    }

                                    return elements;
                                })()}
                            </motion.div>
                        </div>

                        <aside className="detail-sidebar">
                            <div className="sidebar-card share-card">
                                <h3>{i18n.language === 'en' ? 'Share' : (i18n.language === 'uz' ? 'Ulashish' : 'Поделиться')}</h3>
                                <div className="share-buttons">
                                    <button onClick={handleShare} className="share-btn original">
                                        <Share2 size={20} />
                                        <span>{i18n.language === 'en' ? 'Share Article' : 'Поделиться'}</span>
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {selectedImage && (
                <div className="lightbox" onClick={() => setSelectedImage(null)}>
                    <button className="close-lightbox"><X size={32} /></button>
                    <motion.img
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={selectedImage}
                        alt="Enlarged"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default NewsDetail;
