import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Info, Home, Handshake, BookOpen, Newspaper, Layout, Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import './Admin.css';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div className="logo-box">A</div>
                    <span>Alliance Admin</span>
                </div>

                <nav className="nav-links">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        Дашборд
                    </NavLink>

                    <NavLink to="/admin/submissions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Inbox size={20} />
                        Заявки
                    </NavLink>

                    <NavLink to="/admin/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Home size={20} />
                        Главная
                    </NavLink>

                    <NavLink to="/admin/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Info size={20} />
                        О нас
                    </NavLink>

                    <NavLink to="/admin/participants" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Users size={20} />
                        Участники
                    </NavLink>

                    <NavLink to="/admin/partners" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Handshake size={20} />
                        Партнеры
                    </NavLink>

                    <NavLink to="/admin/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <FileText size={20} />
                        Проекты
                    </NavLink>

                    <NavLink to="/admin/groups" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Layout size={20} />
                        Комитеты
                    </NavLink>

                    <NavLink to="/admin/knowledge" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <BookOpen size={20} />
                        База знаний
                    </NavLink>

                    <NavLink to="/admin/news" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Newspaper size={20} />
                        Новости
                    </NavLink>

                    <NavLink to="/admin/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Settings size={20} />
                        Настройки
                    </NavLink>
                </nav>

                <div className="admin-lang-switch">
                    <LanguageSwitcher />
                </div>

                <div className="admin-user">
                    <div className="user-avatar">A</div>
                    <div className="user-info">
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Admin</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Администратор</div>
                    </div>
                    <button onClick={handleSignOut} className="sign-out-btn" title="Выйти">
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
