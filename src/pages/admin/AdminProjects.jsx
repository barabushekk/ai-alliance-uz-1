import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, MoveUp, MoveDown, Globe, Image as ImageIcon, Briefcase, BarChart3, Sparkles } from 'lucide-react';
import '../../pages/admin/Admin.css';
import IconPicker from '../../components/admin/IconPicker';

const AdminProjects = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeLang, setActiveLang] = useState('ru');

    const [sections, setSections] = useState({
        hero: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        projects_header: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        cta: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '', cta_text: '', cta_text_uz: '', cta_text_en: '', cta_link: '' }
    });

    const [stats, setStats] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: sectionsData } = await supabase.from('projects_sections').select('*');
            const { data: statsData } = await supabase.from('projects_stats').select('*').order('sort_order', { ascending: true });
            const { data: projectsData } = await supabase.from('projects_items').select('*').order('sort_order', { ascending: true });

            if (sectionsData) {
                const newSections = { ...sections };
                sectionsData.forEach(item => {
                    if (newSections[item.key]) {
                        newSections[item.key] = { ...newSections[item.key], ...item };
                    }
                });
                setSections(newSections);
            }
            if (statsData) setStats(statsData);
            if (projectsData) setProjects(projectsData);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getFieldName = (baseField) => {
        return activeLang === 'ru' ? baseField : `${baseField}_${activeLang}`;
    };

    const handleSectionChange = (key, field, value) => {
        const targetField = getFieldName(field);
        setSections(prev => ({
            ...prev,
            [key]: { ...prev[key], [targetField]: value }
        }));
    };

    const handleFileUpload = async (file, id) => {
        if (!file) return;
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showNotification('error', 'Файл слишком большой. Максимум 10МБ.');
            return;
        }

        try {
            setSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `projects/${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('projects')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('projects')
                .getPublicUrl(filePath);

            setProjects(prev => prev.map(p => p.id === id ? { ...p, image_url: publicUrl } : p));
            showNotification('success', 'Изображение загружено!');
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('error', `Ошибка загрузки: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleItemChange = (list, setList, id, field, value) => {
        const localizedFields = ['title', 'description', 'status', 'timeline', 'team', 'impact', 'tags', 'label', 'cta_text'];
        const targetField = localizedFields.includes(field) ? getFieldName(field) : field;
        setList(prev => prev.map(item => item.id === id ? { ...item, [targetField]: value } : item));
    };

    const addNewItem = (type) => {
        let newItem = { id: `temp-${Date.now()}`, sort_order: 0 };

        if (type === 'stats') {
            newItem = { ...newItem, value: '0', label: 'Новый показатель', sort_order: stats.length + 1 };
            setStats([...stats, newItem]);
        } else if (type === 'projects') {
            newItem = {
                ...newItem,
                title: 'Новый проект',
                description: '',
                status: 'Планируется',
                timeline: '',
                team: '',
                impact: '',
                tags: '',
                image_url: '',
                sort_order: projects.length + 1
            };
            setProjects([...projects, newItem]);
        }
    };

    const removeItem = (list, setList, id) => {
        setList(list.filter(item => item.id !== id));
    };

    const moveItem = (list, setList, index, direction) => {
        const newList = [...list];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newList.length) return;
        [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
        newList.forEach((item, i) => item.sort_order = i + 1);
        setList(newList);
    };

    const saveAll = async () => {
        setSaving(true);
        setNotification(null);
        try {
            // Sections
            for (const key of Object.keys(sections)) {
                await supabase.from('projects_sections').upsert({ key, ...sections[key] });
            }

            // Sync Stats
            const syncList = async (tableName, localList) => {
                const { data: dbItems } = await supabase.from(tableName).select('id');
                const localIds = localList.filter(item => typeof item.id !== 'string' || !item.id.startsWith('temp-')).map(item => item.id);
                const toDelete = dbItems?.filter(db => !localIds.includes(db.id)).map(db => db.id) || [];
                if (toDelete.length > 0) await supabase.from(tableName).delete().in('id', toDelete);

                for (const item of localList) {
                    const prepared = { ...item };
                    if (typeof prepared.id === 'string' && prepared.id.startsWith('temp-')) delete prepared.id;
                    await supabase.from(tableName).upsert(prepared);
                }
            };

            await syncList('projects_stats', stats);
            await syncList('projects_items', projects);

            showNotification('success', 'Все изменения успешно сохранены!');
            await fetchData();

        } catch (error) {
            console.error(error);
            showNotification('error', 'Ошибка сохранения. Попробуйте снова.');
        } finally {
            setSaving(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const languages = [
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
        { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
        { code: 'en', label: 'English', flag: '🇬🇧' }
    ];

    if (loading) return (
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <Loader className="spin" size={40} color="#2563eb" />
            <p style={{ color: '#64748b', fontWeight: 500 }}>Загрузка редактора проектов...</p>
        </div>
    );

    return (
        <div className="admin-page" style={{ paddingBottom: '120px' }}>
            <div className="admin-page-header">
                <div>
                    <h2>Редактор Проектов</h2>
                    <p>Управляйте списком инициатив и статистикой проектов.</p>
                </div>
                <div className="flex gap-2" style={{ background: '#e2e8f0', padding: '4px', borderRadius: '12px', display: 'flex' }}>
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => setActiveLang(lang.code)}
                            className={`px-4 py-2 text-sm font-bold transition-all ${activeLang === lang.code ? 'active' : ''}`}
                            style={{
                                background: activeLang === lang.code ? 'white' : 'transparent',
                                color: activeLang === lang.code ? '#2563eb' : '#64748b',
                                border: 'none', borderRadius: '8px', cursor: 'pointer',
                                boxShadow: activeLang === lang.code ? '0 4px 6px rgba(0,0,0,0.05)' : 'none',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                            {lang.code.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                    <div style={{ fontWeight: 600 }}>{notification.message}</div>
                </div>
            )}

            {/* Hero Section */}
            <div className="edit-section">
                <div className="section-label">
                    <Globe size={24} color="#2563eb" />
                    Секция Hero
                </div>
                <div className="form-grid">
                    <div>
                        <span className="input-label">Заголовок страницы ({activeLang})</span>
                        <input
                            type="text"
                            value={sections.hero[getFieldName('title')] || ''}
                            onChange={(e) => handleSectionChange('hero', 'title', e.target.value)}
                        />
                    </div>
                    <div>
                        <span className="input-label">Описание ({activeLang})</span>
                        <textarea
                            value={sections.hero[getFieldName('description')] || ''}
                            onChange={(e) => handleSectionChange('hero', 'description', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="section-label">
                        <BarChart3 size={24} color="#2563eb" />
                        Статистика Проектов
                    </div>
                    <button onClick={() => addNewItem('stats')} className="btn-secondary">
                        <Plus size={18} /> Добавить
                    </button>
                </div>
                <div className="stats-admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {stats.map((s, i) => (
                        <div key={s.id} className="list-item" style={{ padding: '15px' }}>
                            <div className="item-controls" style={{ float: 'right' }}>
                                <button className="control-btn delete" onClick={() => removeItem(stats, setStats, s.id)}><Trash2 size={16} /></button>
                            </div>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                <div>
                                    <span className="input-label">Значение (напр. 12+)</span>
                                    <input value={s[getFieldName('value')] || ''} onChange={(e) => handleItemChange(stats, setStats, s.id, 'value', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Иконка</span>
                                    <IconPicker value={s.icon_name || ''} onChange={(val) => handleItemChange(stats, setStats, s.id, 'icon_name', val)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Projects Items Section */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="section-label">
                        <Briefcase size={24} color="#2563eb" />
                        Список Проектов
                    </div>
                    <button onClick={() => addNewItem('projects')} className="btn-secondary">
                        <Plus size={18} /> Добавить проект
                    </button>
                </div>
                <div className="form-grid">
                    <div style={{ marginBottom: '1rem' }}>
                        <span className="input-label">Заголовок списка ({activeLang})</span>
                        <input
                            type="text"
                            value={sections.projects_header[getFieldName('title')] || ''}
                            onChange={(e) => handleSectionChange('projects_header', 'title', e.target.value)}
                        />
                    </div>

                    {projects.map((p, i) => (
                        <div key={p.id} className="list-item">
                            <div className="list-item-header">
                                <span className="item-number">Проект #{i + 1}</span>
                                <div className="item-controls">
                                    <button className="control-btn" onClick={() => moveItem(projects, setProjects, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                    <button className="control-btn" onClick={() => moveItem(projects, setProjects, i, 1)} disabled={i === projects.length - 1}><MoveDown size={16} /></button>
                                    <button className="control-btn delete" onClick={() => removeItem(projects, setProjects, p.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                                <div className="image-upload-preview" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                        <ImageIcon size={20} color="#64748b" />
                                        <span className="input-label" style={{ margin: 0 }}>Изображение</span>
                                    </div>

                                    <div style={{ marginBottom: '15px' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id={`file-${p.id}`}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileUpload(e.target.files[0], p.id)}
                                        />
                                        <label
                                            htmlFor={`file-${p.id}`}
                                            className="btn-secondary"
                                            style={{ width: '100%', cursor: 'pointer', textAlign: 'center', justifyContent: 'center' }}
                                        >
                                            {saving ? 'Загрузка...' : 'Выбрать файл'}
                                        </label>
                                    </div>

                                    <div style={{ marginTop: '10px' }}>
                                        <span className="input-label" style={{ fontSize: '11px', opacity: 0.7 }}>Или вставьте ссылку:</span>
                                        <input
                                            type="text"
                                            placeholder="URL изображения"
                                            value={p.image_url || ''}
                                            onChange={(e) => handleItemChange(projects, setProjects, p.id, 'image_url', e.target.value)}
                                            style={{ fontSize: '11px', padding: '6px' }}
                                        />
                                    </div>

                                    {p.image_url && (
                                        <div style={{ marginTop: '15px', position: 'relative' }}>
                                            <img src={p.image_url} alt="Preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                            <button
                                                className="control-btn delete"
                                                style={{ position: 'absolute', top: '5px', right: '5px', padding: '4px' }}
                                                onClick={() => handleItemChange(projects, setProjects, p.id, 'image_url', '')}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="project-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <span className="input-label">Название проекта ({activeLang})</span>
                                        <input value={p[getFieldName('title')] || ''} onChange={(e) => handleItemChange(projects, setProjects, p.id, 'title', e.target.value)} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <span className="input-label">Описание ({activeLang})</span>
                                        <textarea value={p[getFieldName('description')] || ''} onChange={(e) => handleItemChange(projects, setProjects, p.id, 'description', e.target.value)} />
                                    </div>
                                    <div>
                                        <span className="input-label">Статус ({activeLang})</span>
                                        <input value={p[getFieldName('status')] || ''} onChange={(e) => handleItemChange(projects, setProjects, p.id, 'status', e.target.value)} />
                                    </div>
                                    <div>
                                        <span className="input-label">Сроки ({activeLang})</span>
                                        <input value={p[getFieldName('timeline')] || ''} onChange={(e) => handleItemChange(projects, setProjects, p.id, 'timeline', e.target.value)} />
                                    </div>
                                    <div>
                                        <span className="input-label">Команда ({activeLang})</span>
                                        <input value={p[getFieldName('team')] || ''} onChange={(e) => handleItemChange(projects, setProjects, p.id, 'team', e.target.value)} />
                                    </div>
                                    <div>
                                        <span className="input-label">Эффект ({activeLang})</span>
                                        <input value={p[getFieldName('impact')] || ''} onChange={(e) => handleItemChange(projects, setProjects, p.id, 'impact', e.target.value)} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <span className="input-label">Теги (через запятую) ({activeLang})</span>
                                        <input value={p[getFieldName('tags')] || ''} onChange={(e) => handleItemChange(projects, setProjects, p.id, 'tags', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="edit-section">
                <div className="section-label">
                    <Sparkles size={24} color="#2563eb" />
                    Блок "Предложить идею"
                </div>
                <div className="form-grid">
                    <div>
                        <span className="input-label">Заголовок ({activeLang})</span>
                        <input
                            type="text"
                            value={sections.cta[getFieldName('title')] || ''}
                            onChange={(e) => handleSectionChange('cta', 'title', e.target.value)}
                        />
                    </div>
                    <div>
                        <span className="input-label">Описание ({activeLang})</span>
                        <textarea
                            value={sections.cta[getFieldName('description')] || ''}
                            onChange={(e) => handleSectionChange('cta', 'description', e.target.value)}
                        />
                    </div>
                    <div>
                        <span className="input-label">Текст кнопки ({activeLang})</span>
                        <input
                            type="text"
                            value={sections.cta[getFieldName('cta_text')] || ''}
                            onChange={(e) => handleSectionChange('cta', 'cta_text', e.target.value)}
                        />
                    </div>
                    <div>
                        <span className="input-label">Ссылка кнопки</span>
                        <input
                            type="text"
                            value={sections.cta.cta_link || ''}
                            onChange={(e) => handleSectionChange('cta', 'cta_link', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="save-bars">
                <button
                    onClick={saveAll}
                    disabled={saving}
                    className="btn-primary"
                    style={{ minWidth: '300px' }}
                >
                    {saving ? <Loader className="spin" size={24} /> : <Save size={24} />}
                    {saving ? 'Сохранение...' : 'Сохранить все изменения'}
                </button>
            </div>
        </div>
    );
};

export default AdminProjects;
