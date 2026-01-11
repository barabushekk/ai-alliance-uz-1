import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, MoveUp, MoveDown, ChevronDown, ChevronRight } from 'lucide-react';
import IconPicker from '../../components/admin/IconPicker';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminAbout = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeLang, setActiveLang] = useState('ru');
    const [expandedSections, setExpandedSections] = useState({
        hero: true,
        mission: false,
        vision: false,
        stats: false,
        values: false
    });

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

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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
        { code: 'ru', label: 'RU', flag: '🇷🇺' },
        { code: 'uz', label: 'UZ', flag: '🇺🇿' },
        { code: 'en', label: 'EN', flag: '🇬🇧' }
    ];

    const SectionHeader = ({ title, sectionKey }) => (
        <div
            className="accordion-header"
            onClick={() => toggleSection(sectionKey)}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                background: expandedSections[sectionKey] ? '#f8fafc' : 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                marginBottom: expandedSections[sectionKey] ? '16px' : '12px',
                transition: 'all 0.2s'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {expandedSections[sectionKey] ? <ChevronDown size={20} color="#2563eb" /> : <ChevronRight size={20} color="#64748b" />}
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{title}</span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>{activeLang}</span>
        </div>
    );

    return (
        <div className="admin-page" style={{ paddingBottom: '120px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            {/* Header */}
            <AdminPageHeader
                title='Редактор "О нас"'
                subtitle='Управление контентом страницы "О нас"'
                activeLang={activeLang}
                setActiveLang={setActiveLang}
            />

            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    background: notification.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: '600'
                }}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {notification.message}
                </div>
            )}

            {/* Hero Section */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="🎯 Hero Секция" sectionKey="hero" />
                {expandedSections.hero && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Главный заголовок</label>
                                <input
                                    type="text"
                                    value={sections.hero[getFieldName('title')] || ''}
                                    onChange={(e) => handleSectionChange('hero', 'title', e.target.value)}
                                    placeholder="Введите заголовок..."
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '15px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Описание альянса</label>
                                <textarea
                                    value={sections.hero[getFieldName('description')] || ''}
                                    onChange={(e) => handleSectionChange('hero', 'description', e.target.value)}
                                    placeholder="Введите подробное описание..."
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '120px', fontSize: '15px', fontFamily: 'inherit' }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mission & Vision */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="🎯 Миссия" sectionKey="mission" />
                {expandedSections.mission && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Иконка</label>
                                <IconPicker value={sections.mission.icon || 'Target'} onChange={(val) => handleSectionChange('mission', 'icon', val)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Заголовок миссии</label>
                                <input
                                    value={sections.mission[getFieldName('title')] || ''}
                                    onChange={(e) => handleSectionChange('mission', 'title', e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '15px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Текст миссии</label>
                                <textarea
                                    value={sections.mission[getFieldName('description')] || ''}
                                    onChange={(e) => handleSectionChange('mission', 'description', e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '100px', fontSize: '15px', fontFamily: 'inherit' }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="👁️ Видение" sectionKey="vision" />
                {expandedSections.vision && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Иконка</label>
                                <IconPicker value={sections.vision.icon || 'Eye'} onChange={(val) => handleSectionChange('vision', 'icon', val)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Заголовок видения</label>
                                <input
                                    value={sections.vision[getFieldName('title')] || ''}
                                    onChange={(e) => handleSectionChange('vision', 'title', e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '15px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Текст видения</label>
                                <textarea
                                    value={sections.vision[getFieldName('description')] || ''}
                                    onChange={(e) => handleSectionChange('vision', 'description', e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '100px', fontSize: '15px', fontFamily: 'inherit' }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="📊 Статистика альянса" sectionKey="stats" />
                {expandedSections.stats && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <button
                                onClick={addNewStat}
                                style={{
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Plus size={18} /> Добавить показатель
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                            {stats.map((stat, i) => (
                                <div key={stat.id} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <span style={{ fontWeight: '700', color: '#334155', fontSize: '14px' }}>Показатель #{i + 1}</span>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => moveItem(stats, setStats, i, -1)} disabled={i === 0} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.5 : 1 }}><MoveUp size={14} /></button>
                                            <button onClick={() => moveItem(stats, setStats, i, 1)} disabled={i === stats.length - 1} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', cursor: i === stats.length - 1 ? 'not-allowed' : 'pointer', opacity: i === stats.length - 1 ? 0.5 : 1 }}><MoveDown size={14} /></button>
                                            <button onClick={() => removeStat(stat.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Значение</label>
                                            <input
                                                value={stat.value}
                                                onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Подпись ({activeLang})</label>
                                            <input
                                                value={stat[getFieldName('label')] || ''}
                                                onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Values */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="⭐ Наши Ценности" sectionKey="values" />
                {expandedSections.values && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <button
                                onClick={addNewValue}
                                style={{
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Plus size={18} /> Добавить ценность
                            </button>
                        </div>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {values.map((val, i) => (
                                <div key={val.id} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <span style={{ fontWeight: '700', color: '#334155', fontSize: '14px' }}>Ценность #{i + 1}</span>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => moveItem(values, setValues, i, -1)} disabled={i === 0} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.5 : 1 }}><MoveUp size={14} /></button>
                                            <button onClick={() => moveItem(values, setValues, i, 1)} disabled={i === values.length - 1} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', cursor: i === values.length - 1 ? 'not-allowed' : 'pointer', opacity: i === values.length - 1 ? 0.5 : 1 }}><MoveDown size={14} /></button>
                                            <button onClick={() => removeValue(val.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 2fr', gap: '16px', alignItems: 'start' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Иконка</label>
                                            <IconPicker value={val.icon || 'Zap'} onChange={(v) => handleValueChange(val.id, 'icon', v)} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Заголовок ({activeLang})</label>
                                            <input
                                                value={val[getFieldName('title')] || ''}
                                                onChange={(e) => handleValueChange(val.id, 'title', e.target.value)}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Описание ({activeLang})</label>
                                            <textarea
                                                value={val[getFieldName('description')] || ''}
                                                onChange={(e) => handleValueChange(val.id, 'description', e.target.value)}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '80px', fontSize: '14px', fontFamily: 'inherit' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div style={{
                position: 'fixed',
                bottom: '0',
                left: '280px',
                right: '0',
                background: 'white',
                borderTop: '1px solid #e2e8f0',
                padding: '20px 40px',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 100
            }}>
                <button
                    onClick={saveAll}
                    disabled={saving}
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '16px 48px',
                        borderRadius: '12px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontWeight: '700',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                        minWidth: '300px',
                        justifyContent: 'center'
                    }}
                >
                    {saving ? <Loader className="spin" size={20} /> : <Save size={20} />}
                    {saving ? 'Сохранение...' : 'Сохранить все изменения'}
                </button>
            </div>
        </div>
    );
};

export default AdminAbout;
