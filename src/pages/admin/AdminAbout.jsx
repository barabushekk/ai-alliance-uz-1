import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, MoveUp, MoveDown, Globe, Info, Target, Eye, BarChart3, Star } from 'lucide-react';
import IconPicker from '../../components/admin/IconPicker';

const AdminAbout = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeLang, setActiveLang] = useState('ru');

    const [sections, setSections] = useState({
        hero: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        mission: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '', icon: 'Target' },
        vision: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '', icon: 'Eye' }
    });
    const [stats, setStats] = useState([]);
    const [values, setValues] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: sectionsData } = await supabase.from('about_sections').select('*');
            const { data: statsData } = await supabase.from('about_stats').select('*').order('sort_order', { ascending: true });
            const { data: valuesData } = await supabase.from('about_values').select('*').order('sort_order', { ascending: true });

            if (sectionsData) {
                const newSections = { ...sections };
                sectionsData.forEach(item => {
                    newSections[item.key] = { ...newSections[item.key], ...item };
                });
                setSections(newSections);
            }
            if (statsData) setStats(statsData);
            if (valuesData) setValues(valuesData);

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
        const targetField = field.includes('title') || field.includes('description') ? getFieldName(field) : field;
        setSections(prev => ({
            ...prev,
            [key]: { ...prev[key], [targetField]: value }
        }));
    };

    const handleStatChange = (id, field, value) => {
        const targetField = field === 'label' ? getFieldName(field) : field;
        setStats(prev => prev.map(item => item.id === id ? { ...item, [targetField]: value } : item));
    };

    const handleValueChange = (id, field, value) => {
        const targetField = field === 'title' || field === 'description' ? getFieldName(field) : field;
        setValues(prev => prev.map(item => item.id === id ? { ...item, [targetField]: value } : item));
    };

    const addNewStat = () => {
        const newStat = {
            id: `temp-${Date.now()}`,
            value: '0',
            label: 'Новый показатель',
            label_uz: '',
            label_en: '',
            sort_order: stats.length + 1
        };
        setStats([...stats, newStat]);
    };

    const removeStat = (id) => {
        setStats(stats.filter(s => s.id !== id));
    };

    const addNewValue = () => {
        const newValue = {
            id: `temp-${Date.now()}`,
            title: 'Новая ценность',
            description: 'Описание ценности...',
            title_uz: '',
            description_uz: '',
            title_en: '',
            description_en: '',
            icon: 'Zap',
            sort_order: values.length + 1
        };
        setValues([...values, newValue]);
    };

    const removeValue = (id) => {
        setValues(values.filter(v => v.id !== id));
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
            for (const key of Object.keys(sections)) {
                await supabase.from('about_sections').upsert({
                    key,
                    ...sections[key]
                });
            }

            const { data: dbStats } = await supabase.from('about_stats').select('id');
            const localStatIds = stats.filter(s => typeof s.id === 'number').map(s => s.id);
            const statsToDelete = dbStats.filter(s => !localStatIds.includes(s.id)).map(s => s.id);
            if (statsToDelete.length > 0) await supabase.from('about_stats').delete().in('id', statsToDelete);

            for (const stat of stats) {
                const prepared = { ...stat };
                if (typeof prepared.id === 'string' && prepared.id.startsWith('temp-')) delete prepared.id;
                await supabase.from('about_stats').upsert(prepared);
            }

            const { data: dbValues } = await supabase.from('about_values').select('id');
            const localValueIds = values.filter(v => typeof v.id === 'number').map(v => v.id);
            const valuesToDelete = dbValues.filter(v => !localValueIds.includes(v.id)).map(v => v.id);
            if (valuesToDelete.length > 0) await supabase.from('about_values').delete().in('id', valuesToDelete);

            for (const val of values) {
                const prepared = { ...val };
                if (typeof prepared.id === 'string' && prepared.id.startsWith('temp-')) delete prepared.id;
                await supabase.from('about_values').upsert(prepared);
            }

            showNotification('success', 'Все изменения успешно сохранены!');
            await fetchData();
        } catch (error) {
            console.error(error);
            showNotification('error', 'Ошибка сохранения. Проверьте консоль.');
        } finally {
            setSaving(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    if (loading) return (
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <Loader className="spin" size={40} color="#2563eb" />
            <p style={{ color: '#64748b', fontWeight: 500 }}>Загрузка редактора...</p>
        </div>
    );

    const languages = [
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
        { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
        { code: 'en', label: 'English', flag: '🇬🇧' }
    ];

    return (
        <div className="admin-page" style={{ paddingBottom: '120px' }}>
            <div className="admin-page-header">
                <div>
                    <h2>Редактор "О нас"</h2>
                    <p>Управление контентом страницы "О нас".</p>
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
                    <Info size={24} color="#2563eb" />
                    Секция Hero
                    <span className="section-label-badge">{activeLang}</span>
                </div>
                <div className="form-grid">
                    <div>
                        <span className="input-label">Главный заголовок</span>
                        <input
                            type="text"
                            value={sections.hero[getFieldName('title')] || ''}
                            onChange={(e) => handleSectionChange('hero', 'title', e.target.value)}
                            placeholder="Введите заголовок..."
                        />
                    </div>
                    <div>
                        <span className="input-label">Описание альянса</span>
                        <textarea
                            value={sections.hero[getFieldName('description')] || ''}
                            onChange={(e) => handleSectionChange('hero', 'description', e.target.value)}
                            placeholder="Введите подробное описание..."
                        />
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="edit-section">
                    <div className="section-label">
                        <Target size={24} color="#2563eb" />
                        Миссия
                        <span className="section-label-badge">{activeLang}</span>
                    </div>
                    <div className="form-grid">
                        <div>
                            <span className="input-label">Иконка</span>
                            <IconPicker value={sections.mission.icon || 'Target'} onChange={(val) => handleSectionChange('mission', 'icon', val)} />
                        </div>
                        <div>
                            <span className="input-label">Заголовок миссии</span>
                            <input
                                value={sections.mission[getFieldName('title')] || ''}
                                onChange={(e) => handleSectionChange('mission', 'title', e.target.value)}
                            />
                        </div>
                        <div>
                            <span className="input-label">Текст миссии</span>
                            <textarea
                                value={sections.mission[getFieldName('description')] || ''}
                                onChange={(e) => handleSectionChange('mission', 'description', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="edit-section">
                    <div className="section-label">
                        <Eye size={24} color="#2563eb" />
                        Видение
                        <span className="section-label-badge">{activeLang}</span>
                    </div>
                    <div className="form-grid">
                        <div>
                            <span className="input-label">Иконка</span>
                            <IconPicker value={sections.vision.icon || 'Eye'} onChange={(val) => handleSectionChange('vision', 'icon', val)} />
                        </div>
                        <div>
                            <span className="input-label">Заголовок видения</span>
                            <input
                                value={sections.vision[getFieldName('title')] || ''}
                                onChange={(e) => handleSectionChange('vision', 'title', e.target.value)}
                            />
                        </div>
                        <div>
                            <span className="input-label">Текст видения</span>
                            <textarea
                                value={sections.vision[getFieldName('description')] || ''}
                                onChange={(e) => handleSectionChange('vision', 'description', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className="section-label">
                        <BarChart3 size={24} color="#2563eb" />
                        Статистика альянса
                    </div>
                    <button onClick={addNewStat} className="btn-secondary">
                        <Plus size={18} /> Добавить показатель
                    </button>
                </div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {stats.map((stat, i) => (
                        <div key={stat.id} className="list-item">
                            <div className="list-item-header">
                                <span className="item-number">Показатель #{i + 1}</span>
                                <div className="item-controls">
                                    <button className="control-btn" onClick={() => moveItem(stats, setStats, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                    <button className="control-btn" onClick={() => moveItem(stats, setStats, i, 1)} disabled={i === stats.length - 1}><MoveDown size={16} /></button>
                                    <button className="control-btn delete" onClick={() => removeStat(stat.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '15px', marginTop: 0 }}>
                                <div>
                                    <span className="input-label">Значение</span>
                                    <input value={stat.value} onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Подпись ({activeLang})</span>
                                    <input value={stat[getFieldName('label')] || ''} onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Values */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className="section-label">
                        <Star size={24} color="#2563eb" />
                        Наши Ценности
                    </div>
                    <button onClick={addNewValue} className="btn-secondary">
                        <Plus size={18} /> Добавить ценность
                    </button>
                </div>
                <div className="form-grid">
                    {values.map((val, i) => (
                        <div key={val.id} className="list-item">
                            <div className="list-item-header">
                                <span className="item-number">Ценность #{i + 1}</span>
                                <div className="item-controls">
                                    <button className="control-btn" onClick={() => moveItem(values, setValues, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                    <button className="control-btn" onClick={() => moveItem(values, setValues, i, 1)} disabled={i === values.length - 1}><MoveDown size={16} /></button>
                                    <button className="control-btn delete" onClick={() => removeValue(val.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '200px 1fr 2fr', gap: '24px', marginTop: 10 }}>
                                <div>
                                    <span className="input-label">Иконка</span>
                                    <IconPicker value={val.icon || 'Zap'} onChange={(v) => handleValueChange(val.id, 'icon', v)} />
                                </div>
                                <div>
                                    <span className="input-label">Заголовок ({activeLang})</span>
                                    <input value={val[getFieldName('title')] || ''} onChange={(e) => handleValueChange(val.id, 'title', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Описание ({activeLang})</span>
                                    <textarea value={val[getFieldName('description')] || ''} onChange={(e) => handleValueChange(val.id, 'description', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
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

export default AdminAbout;
