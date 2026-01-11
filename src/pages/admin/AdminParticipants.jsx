import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, MoveUp, MoveDown, Users, Globe, Zap, Target, Shield, BookOpen, Building2 } from 'lucide-react';
import IconPicker from '../../components/admin/IconPicker';
import '../../pages/admin/Admin.css';

const AdminParticipants = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeLang, setActiveLang] = useState('ru');

    const [sections, setSections] = useState({
        hero: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        benefits_header: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        types_header: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        req_header: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        steps_header: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '', cta_text: '', cta_text_uz: '', cta_text_en: '', cta_link: '' }
    });

    const [benefits, setBenefits] = useState([]);
    const [types, setTypes] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: sectionsData } = await supabase.from('participants_sections').select('*');
            const { data: benefitsData } = await supabase.from('participants_benefits').select('*').order('sort_order', { ascending: true });
            const { data: typesData } = await supabase.from('participants_types').select('*').order('sort_order', { ascending: true });
            const { data: requirementsData } = await supabase.from('participants_requirements').select('*').order('sort_order', { ascending: true });
            const { data: stepsData } = await supabase.from('participants_steps').select('*').order('sort_order', { ascending: true });

            if (sectionsData) {
                const newSections = { ...sections };
                sectionsData.forEach(item => {
                    if (newSections[item.key]) {
                        newSections[item.key] = { ...newSections[item.key], ...item };
                    }
                });
                setSections(newSections);
            }
            if (benefitsData) setBenefits(benefitsData);
            if (typesData) setTypes(typesData);
            if (requirementsData) setRequirements(requirementsData);
            if (stepsData) setSteps(stepsData);

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

    const handleItemChange = (list, setList, id, field, value) => {
        const localizedFields = ['title', 'description', 'benefits_list', 'items_list', 'label'];
        const targetField = localizedFields.includes(field) ? getFieldName(field) : field;
        setList(prev => prev.map(item => item.id === id ? { ...item, [targetField]: value } : item));
    };

    const addNewItem = (section) => {
        let newItem = { id: `temp-${Date.now()}`, sort_order: 0 };

        switch (section) {
            case 'benefits':
                newItem = { ...newItem, icon: 'CheckCircle', title: 'Новое преимущество', description: '', sort_order: benefits.length + 1 };
                setBenefits([...benefits, newItem]);
                break;
            case 'types':
                newItem = { ...newItem, icon: 'Building2', title: 'Новый тип', benefits_list: '', sort_order: types.length + 1 };
                setTypes([...types, newItem]);
                break;
            case 'requirements':
                newItem = { ...newItem, title: 'Новое требование', items_list: '', sort_order: requirements.length + 1 };
                setRequirements([...requirements, newItem]);
                break;
            case 'steps':
                newItem = { ...newItem, step_num: steps.length + 1, title: 'Новый шаг', description: '', sort_order: steps.length + 1 };
                setSteps([...steps, newItem]);
                break;
            default: break;
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
                await supabase.from('participants_sections').upsert({ key, ...sections[key] });
            }

            // Helper for upserting lists
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

            await syncList('participants_benefits', benefits);
            await syncList('participants_types', types);
            await syncList('participants_requirements', requirements);
            await syncList('participants_steps', steps);

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
            <p style={{ color: '#64748b', fontWeight: 500 }}>Загрузка редактора участников...</p>
        </div>
    );

    return (
        <div className="admin-page" style={{ paddingBottom: '120px' }}>
            <div className="admin-page-header">
                <div>
                    <h2>Редактор "Участники"</h2>
                    <p>Полное управление контентом страницы участников.</p>
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
                        <span className="input-label">Подзаголовок ({activeLang})</span>
                        <textarea
                            value={sections.hero[getFieldName('description')] || ''}
                            onChange={(e) => handleSectionChange('hero', 'description', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="section-label">
                        <Zap size={24} color="#2563eb" />
                        Преимущества
                    </div>
                    <button onClick={() => addNewItem('benefits')} className="btn-secondary">
                        <Plus size={18} /> Добавить
                    </button>
                </div>
                <div className="form-grid">
                    <div style={{ marginBottom: '1rem' }}>
                        <span className="input-label">Заголовок блока ({activeLang})</span>
                        <input
                            type="text"
                            value={sections.benefits_header[getFieldName('title')] || ''}
                            onChange={(e) => handleSectionChange('benefits_header', 'title', e.target.value)}
                        />
                    </div>
                    {benefits.map((b, i) => (
                        <div key={b.id} className="list-item">
                            <div className="list-item-header">
                                <span className="item-number">#{i + 1} Benefit</span>
                                <div className="item-controls">
                                    <button className="control-btn" onClick={() => moveItem(benefits, setBenefits, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                    <button className="control-btn" onClick={() => moveItem(benefits, setBenefits, i, 1)} disabled={i === benefits.length - 1}><MoveDown size={16} /></button>
                                    <button className="control-btn delete" onClick={() => removeItem(benefits, setBenefits, b.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '150px 1fr 2fr', gap: '20px' }}>
                                <div>
                                    <span className="input-label">Иконка</span>
                                    <IconPicker value={b.icon || 'CheckCircle'} onChange={(v) => handleItemChange(benefits, setBenefits, b.id, 'icon', v)} />
                                </div>
                                <div>
                                    <span className="input-label">Заголовок ({activeLang})</span>
                                    <input value={b[getFieldName('title')] || ''} onChange={(e) => handleItemChange(benefits, setBenefits, b.id, 'title', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Описание ({activeLang})</span>
                                    <textarea value={b[getFieldName('description')] || ''} onChange={(e) => handleItemChange(benefits, setBenefits, b.id, 'description', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Participation Types */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="section-label">
                        <Building2 size={24} color="#2563eb" />
                        Типы участия (Форматы)
                    </div>
                    <button onClick={() => addNewItem('types')} className="btn-secondary">
                        <Plus size={18} /> Добавить
                    </button>
                </div>
                <div className="form-grid">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '1rem' }}>
                        <div>
                            <span className="input-label">Заголовок блока ({activeLang})</span>
                            <input
                                type="text"
                                value={sections.types_header[getFieldName('title')] || ''}
                                onChange={(e) => handleSectionChange('types_header', 'title', e.target.value)}
                            />
                        </div>
                        <div>
                            <span className="input-label">Подзаголовок ({activeLang})</span>
                            <input
                                type="text"
                                value={sections.types_header[getFieldName('description')] || ''}
                                onChange={(e) => handleSectionChange('types_header', 'description', e.target.value)}
                            />
                        </div>
                    </div>
                    {types.map((t, i) => (
                        <div key={t.id} className="list-item">
                            <div className="list-item-header">
                                <span className="item-number">#{i + 1} Type</span>
                                <div className="item-controls">
                                    <button className="control-btn" onClick={() => moveItem(types, setTypes, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                    <button className="control-btn" onClick={() => moveItem(types, setTypes, i, 1)} disabled={i === types.length - 1}><MoveDown size={16} /></button>
                                    <button className="control-btn delete" onClick={() => removeItem(types, setTypes, t.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '150px 1fr 2fr', gap: '20px' }}>
                                <div>
                                    <span className="input-label">Иконка</span>
                                    <IconPicker value={t.icon || 'Building2'} onChange={(v) => handleItemChange(types, setTypes, t.id, 'icon', v)} />
                                </div>
                                <div>
                                    <span className="input-label">Название ({activeLang})</span>
                                    <input value={t[getFieldName('title')] || ''} onChange={(e) => handleItemChange(types, setTypes, t.id, 'title', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Список преимуществ (через Enter) ({activeLang})</span>
                                    <textarea
                                        style={{ height: '100px' }}
                                        value={t[getFieldName('benefits_list')] || ''}
                                        onChange={(e) => handleItemChange(types, setTypes, t.id, 'benefits_list', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Requirements Section */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="section-label">
                        <Shield size={24} color="#2563eb" />
                        Требования
                    </div>
                    <button onClick={() => addNewItem('requirements')} className="btn-secondary">
                        <Plus size={18} /> Добавить
                    </button>
                </div>
                <div className="form-grid">
                    <div style={{ marginBottom: '1rem' }}>
                        <span className="input-label">Заголовок блока ({activeLang})</span>
                        <input
                            type="text"
                            value={sections.req_header[getFieldName('title')] || ''}
                            onChange={(e) => handleSectionChange('req_header', 'title', e.target.value)}
                        />
                    </div>
                    {requirements.map((r, i) => (
                        <div key={r.id} className="list-item">
                            <div className="list-item-header">
                                <span className="item-number">#{i + 1} Requirement Card</span>
                                <div className="item-controls">
                                    <button className="control-btn" onClick={() => moveItem(requirements, setRequirements, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                    <button className="control-btn" onClick={() => moveItem(requirements, setRequirements, i, 1)} disabled={i === requirements.length - 1}><MoveDown size={16} /></button>
                                    <button className="control-btn delete" onClick={() => removeItem(requirements, setRequirements, r.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                                <div>
                                    <span className="input-label">Категория ({activeLang})</span>
                                    <input value={r[getFieldName('title')] || ''} onChange={(e) => handleItemChange(requirements, setRequirements, r.id, 'title', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Список пунктов (через Enter) ({activeLang})</span>
                                    <textarea
                                        style={{ height: '100px' }}
                                        value={r[getFieldName('items_list')] || ''}
                                        onChange={(e) => handleItemChange(requirements, setRequirements, r.id, 'items_list', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Steps Section */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div className="section-label">
                        <BookOpen size={24} color="#2563eb" />
                        Как вступить (Шаги)
                    </div>
                    <button onClick={() => addNewItem('steps')} className="btn-secondary">
                        <Plus size={18} /> Добавить
                    </button>
                </div>
                <div className="form-grid">
                    <div style={{ marginBottom: '1rem' }}>
                        <span className="input-label">Заголовок блока ({activeLang})</span>
                        <input
                            type="text"
                            value={sections.steps_header[getFieldName('title')] || ''}
                            onChange={(e) => handleSectionChange('steps_header', 'title', e.target.value)}
                        />
                    </div>
                    {steps.map((s, i) => (
                        <div key={s.id} className="list-item">
                            <div className="list-item-header">
                                <span className="item-number">Шаг {s.step_num || i + 1}</span>
                                <div className="item-controls">
                                    <button className="control-btn" onClick={() => moveItem(steps, setSteps, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                    <button className="control-btn" onClick={() => moveItem(steps, setSteps, i, 1)} disabled={i === steps.length - 1}><MoveDown size={16} /></button>
                                    <button className="control-btn delete" onClick={() => removeItem(steps, setSteps, s.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                                <div>
                                    <span className="input-label">Заголовок ({activeLang})</span>
                                    <input value={s[getFieldName('title')] || ''} onChange={(e) => handleItemChange(steps, setSteps, s.id, 'title', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Описание ({activeLang})</span>
                                    <textarea value={s[getFieldName('description')] || ''} onChange={(e) => handleItemChange(steps, setSteps, s.id, 'description', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="form-grid" style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', gridTemplateColumns: '1fr 1fr' }}>
                        <div>
                            <span className="input-label">Текст кнопки (CTA) ({activeLang})</span>
                            <input
                                type="text"
                                value={sections.steps_header[getFieldName('cta_text')] || ''}
                                onChange={(e) => handleSectionChange('steps_header', 'cta_text', e.target.value)}
                                placeholder="Напр: Заполнить анкету"
                            />
                        </div>
                        <div>
                            <span className="input-label">Ссылка кнопки (URL)</span>
                            <input
                                type="text"
                                value={sections.steps_header.cta_link || ''}
                                onChange={(e) => handleSectionChange('steps_header', 'cta_link', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
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

export default AdminParticipants;
