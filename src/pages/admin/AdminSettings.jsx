import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    Save, Loader, Eye, EyeOff, GripVertical,
    Settings, Globe, Share2, Mail, Phone, MapPin
} from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pages, setPages] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_pages')
            .select('*')
            .order('sort_order', { ascending: true });

        if (!error) setPages(data);
        setLoading(false);
    };

    const togglePageActive = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const { error } = await supabase
            .from('site_pages')
            .update({ is_active: newStatus })
            .eq('id', id);

        if (!error) {
            setPages(pages.map(p => p.id === id ? { ...p, is_active: newStatus } : p));
        }
    };

    const saveOrder = async () => {
        setSaving(true);
        try {
            for (let i = 0; i < pages.length; i++) {
                await supabase
                    .from('site_pages')
                    .update({ sort_order: i + 1 })
                    .eq('id', pages[i].id);
            }
            showNotification('success', 'Порядок страниц сохранен!');
        } catch (error) {
            showNotification('error', 'Ошибка при сохранении порядка.');
        } finally {
            setSaving(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    if (loading) return <div className="admin-page"><Loader className="spin" /></div>;

    return (
        <div className="admin-page">
            <AdminPageHeader
                title="Настройки сайта"
                subtitle="Управление навигацией и глобальными параметрами"
                activeLang="ru"
                setActiveLang={() => { }}
            />

            {notification && (
                <div className={`notification ${notification.type}`} style={{
                    position: 'fixed', top: '24px', right: '24px', zIndex: 1000,
                    padding: '16px 24px', borderRadius: '12px', background: notification.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                }}>
                    {notification.message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Navigation Management */}
                <div className="edit-section" style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Globe size={24} color="#6366f1" /> Управление меню
                        </h3>
                        <button onClick={saveOrder} disabled={saving} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px' }}>
                            {saving ? '...' : 'Сохранить порядок'}
                        </button>
                    </div>

                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                        Переключайте видимость страниц в главном меню и футере сайта.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {pages.map((page, index) => (
                            <div key={page.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '16px 20px', background: '#f8fafc', borderRadius: '16px',
                                border: '1px solid #e2e8f0', transition: 'all 0.2s'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ color: '#cbd5e1', cursor: 'grab' }}><GripVertical size={20} /></div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{page.default_title}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{page.path}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => togglePageActive(page.id, page.is_active)}
                                    style={{
                                        background: page.is_active ? '#dcfce7' : '#fee2e2',
                                        color: page.is_active ? '#15803d' : '#ef4444',
                                        border: 'none', padding: '8px 16px', borderRadius: '10px',
                                        fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px', justifyContent: 'center'
                                    }}
                                >
                                    {page.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                    {page.is_active ? 'Активна' : 'Скрыта'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Info (Placeholder for now) */}
                <div className="edit-section" style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Share2 size={24} color="#6366f1" /> Контакты Альянса
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
                        Контактная информация, отображаемая в футере и на странице контактов.
                    </p>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Mail size={16} /> Email
                            </label>
                            <input
                                defaultValue="info@ai-alliance.uz"
                                style={{ width: '100%', padding: '12px 16px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Phone size={16} /> Телефон
                            </label>
                            <input
                                defaultValue="+998 (__) ___-__-__"
                                style={{ width: '100%', padding: '12px 16px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <MapPin size={16} /> Адрес (RU)
                            </label>
                            <input
                                defaultValue="Ташкент, Узбекистан"
                                style={{ width: '100%', padding: '12px 16px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}
                            />
                        </div>
                    </div>

                    <button className="btn-primary" style={{ marginTop: '32px', width: '100%', padding: '16px' }}>
                        Сохранить контакты
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
