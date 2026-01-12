import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Loader, User, Building, Mail, Phone, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import './ApplicationModal.css';

const ApplicationModal = ({ isOpen, onClose, type = 'membership' }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        organization: '',
        email: '',
        phone: '',
        message: ''
    });

    if (!isOpen && !success) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('submissions').insert([{
                type,
                ...formData,
                status: 'new'
            }]);

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({ full_name: '', organization: '', email: '', phone: '', message: '' });
                onClose();
            }, 3000);
        } catch (err) {
            console.error('Submission error:', err);
            alert(t('modal.error_message'));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const modalTitle = t(`modal.${type}_title`, { defaultValue: t('modal.default_title') });

    return (
        <AnimatePresence>
            {(isOpen || success) && (
                <div className="modal-overlay">
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="modal-container"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <button className="modal-close" onClick={onClose}>
                            <X size={24} />
                        </button>

                        {!success ? (
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2>{modalTitle}</h2>
                                    <p>{t('modal.subtitle')}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="modal-form">
                                    <div className="input-group">
                                        <label><User size={16} /> {t('modal.full_name')}</label>
                                        <input
                                            required
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            placeholder={t('modal.full_name_placeholder')}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label><Building size={16} /> {t('modal.organization')}</label>
                                        <input
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            placeholder={t('modal.organization_placeholder')}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="input-group">
                                            <label><Mail size={16} /> {t('modal.email')}</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder={t('modal.email_placeholder')}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label><Phone size={16} /> {t('modal.phone')}</label>
                                            <input
                                                required
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder={t('modal.phone_placeholder')}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label><MessageSquare size={16} /> {t('modal.message')}</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder={t('modal.message_placeholder')}
                                            rows="3"
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        className="modal-submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {loading ? (
                                            <Loader className="spin" size={20} />
                                        ) : (
                                            <>
                                                <span>{t('modal.submit')}</span>
                                                <Send size={18} />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        ) : (
                            <motion.div
                                className="modal-success"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="success-icon-box">
                                    <CheckCircle size={60} color="#10b981" />
                                </div>
                                <h3>{t('modal.success_title')}</h3>
                                <p>{t('modal.success_message')}</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ApplicationModal;
