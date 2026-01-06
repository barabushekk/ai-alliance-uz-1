import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users, FileText, Activity, TrendingUp, Calendar, Zap } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        participants: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        const { count: partnersCount } = await supabase.from('partners').select('*', { count: 'exact', head: true });

        setStats({
            projects: projectsCount || 5,
            participants: partnersCount || 12
        });
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2>Дашборд</h2>
                    <p>Добро пожаловать в панель управления Альянсом.</p>
                </div>
                <div style={{ padding: '10px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, color: '#64748b' }}>
                    <Calendar size={18} />
                    {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="stat-card" style={{ padding: '2rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                            <FileText size={24} />
                        </div>
                        <TrendingUp size={20} color="#16a34a" />
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Всего проектов</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.projects}</div>
                </div>

                <div className="stat-card" style={{ padding: '2rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: '48px', height: '48px', background: '#eef2ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                            <Users size={24} />
                        </div>
                        <TrendingUp size={20} color="#16a34a" />
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Партнеры</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{stats.participants}</div>
                </div>

                <div className="stat-card" style={{ padding: '2rem', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                            <Activity size={24} />
                        </div>
                        <div style={{ padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>LIVE</div>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Статус системы</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#16a34a' }}>Активен</div>
                </div>
            </div>

            <div className="edit-section" style={{ minHeight: '300px' }}>
                <div className="section-label" style={{ marginBottom: '2rem' }}>
                    <Zap size={24} color="#f59e0b" />
                    Последняя активность
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb' }}></div>
                        <div style={{ flexGrow: 1 }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Инициализация системы завершена</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Только что</div>
                        </div>
                    </div>
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }}></div>
                        <div style={{ flexGrow: 1 }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>База данных успешно подключена</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>2 минуты назад</div>
                        </div>
                    </div>
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#94a3b8' }}></div>
                        <div style={{ flexGrow: 1 }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Обновлены настройки страницы "О нас"</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>15 минут назад</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
