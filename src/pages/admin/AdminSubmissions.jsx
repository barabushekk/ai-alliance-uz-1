import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    Mail, Phone, Building, Calendar, CheckCircle,
    Trash2, Eye, Filter, RefreshCw, ChevronRight,
    Clock, Archive, User
} from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setSubmissions(data);
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        const { error } = await supabase
            .from('submissions')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setSubmissions(submissions.map(s => s.id === id ? { ...s, status: newStatus } : s));
            if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, status: newStatus });
        }
    };

    const deleteSubmission = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) return;
        const { error } = await supabase.from('submissions').delete().eq('id', id);
        if (!error) {
            setSubmissions(submissions.filter(s => s.id !== id));
            setSelectedItem(null);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            new: { bg: '#fee2e2', text: '#ef4444', label: 'Новая' },
            viewed: { bg: '#fef9c3', text: '#a16207', label: 'Просмотрена' },
            contacted: { bg: '#dbeafe', text: '#2563eb', label: 'В работе' },
            completed: { bg: '#dcfce7', text: '#15803d', label: 'Завершена' }
        };
        const s = styles[status] || styles.new;
        return (
            <span style={{
                background: s.bg,
                color: s.text,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700'
            }}>
                {s.label}
            </span>
        );
    };

    const filtered = submissions.filter(s => filter === 'all' || s.status === filter);

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <AdminPageHeader
                title="Реестр Заявок"
                subtitle="Управление входящими анкетами и заявками на вступление"
                activeLang="ru"
                setActiveLang={() => { }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
                {/* Main List */}
                <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {['all', 'new', 'viewed', 'contacted', 'completed'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: filter === f ? '#6366f1' : '#f1f5f9',
                                        color: filter === f ? 'white' : '#64748b',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {f === 'all' ? 'Все' : f === 'new' ? 'Новые' : f === 'viewed' ? 'Просмотренные' : f === 'contacted' ? 'В работе' : 'Архив'}
                                </button>
                            ))}
                        </div>
                        <button onClick={fetchSubmissions} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }}>
                            <RefreshCw size={20} className={loading ? 'spin' : ''} />
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Отправитель</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Тип</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Статус</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Дата</th>
                                    <th style={{ padding: '16px 24px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Загрузка заявок...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Заявок не найдено</td></tr>
                                ) : filtered.map(item => (
                                    <tr
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedItem(item);
                                            if (item.status === 'new') updateStatus(item.id, 'viewed');
                                        }}
                                        style={{
                                            borderBottom: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            background: selectedItem?.id === item.id ? '#fcfdff' : 'transparent',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.full_name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{item.organization}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: '13px', color: '#475569', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>
                                                {item.type === 'membership' ? 'Участник' : item.type === 'partner' ? 'Партнер' : 'Другое'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>{getStatusBadge(item.status)}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>
                                            {new Date(item.created_at).toLocaleDateString('ru-RU')}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <ChevronRight size={18} color="#cbd5e1" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail View */}
                <div style={{ position: 'sticky', top: '24px' }}>
                    {selectedItem ? (
                        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                                    <User size={32} />
                                </div>
                                <button onClick={() => deleteSubmission(selectedItem.id)} style={{ color: '#ef4444', background: '#fef2f2', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>{selectedItem.full_name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                                <Building size={14} /> {selectedItem.organization}
                            </div>

                            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ color: '#6366f1' }}><Mail size={18} /></div>
                                    <a href={`mailto:${selectedItem.email}`} style={{ color: '#0f172a', fontWeight: '600', textDecoration: 'none' }}>{selectedItem.email}</a>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ color: '#6366f1' }}><Phone size={18} /></div>
                                    <a href={`tel:${selectedItem.phone}`} style={{ color: '#0f172a', fontWeight: '600', textDecoration: 'none' }}>{selectedItem.phone}</a>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ color: '#6366f1' }}><Calendar size={18} /></div>
                                    <div style={{ color: '#0f172a', fontWeight: '600' }}>{new Date(selectedItem.created_at).toLocaleString('ru-RU')}</div>
                                </div>
                            </div>

                            {selectedItem.message && (
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', marginBottom: '32px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Сообщение</div>
                                    <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>{selectedItem.message}</div>
                                </div>
                            )}

                            <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Изменить статус</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <button onClick={() => updateStatus(selectedItem.id, 'contacted')} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: selectedItem.status === 'contacted' ? '#dbeafe' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                                    <Clock size={16} /> В работу
                                </button>
                                <button onClick={() => updateStatus(selectedItem.id, 'completed')} style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: selectedItem.status === 'completed' ? '#dcfce7' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                                    <Archive size={16} /> В архив
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0', padding: '60px 40px', textAlign: 'center', color: '#94a3b8' }}>
                            <Eye size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>Выберите заявку из списка для просмотра деталей</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSubmissions;
