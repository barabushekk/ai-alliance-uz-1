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
            alert('Ошибка при отправке. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const modalTitle = type === 'membership'
        ? 'Заявка на вступление'
        : type === 'partner'
            ? 'Стать партнером'
            : type === 'committee'
                ? 'Заявка в комитет'
                : type === 'knowledge'
                    ? 'Ваше предложение'
                    : 'Анкета участника';

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
                                    <p>Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="modal-form">
                                    <div className="input-group">
                                        <label><User size={16} /> ФИО</label>
                                        <input
                                            required
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            placeholder="Иванов Иван Иванович"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label><Building size={16} /> Организация</label>
                                        <input
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            placeholder="Название вашей компании"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="input-group">
                                            <label><Mail size={16} /> Email</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="example@mail.com"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label><Phone size={16} /> Телефон</label>
                                            <input
                                                required
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+998 (__) ___-__-__"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label><MessageSquare size={16} /> Комментарий (необязательно)</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Ваш вопрос или сообщение..."
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
                                                <span>Отправить заявку</span>
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
                                <h3>Заявка отправлена!</h3>
                                <p>Спасибо за интерес к Альянсу. Мы свяжемся с вами в ближайшее время.</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ApplicationModal;
