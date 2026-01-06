import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, MoveUp, MoveDown, Users, Globe, Zap, Target } from 'lucide-react';
import IconPicker from '../../components/admin/IconPicker';
import '../../pages/admin/Admin.css';

const AdminParticipants = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeLang, setActiveLang] = useState('ru');

    const [sections, setSections] = useState({
        hero: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        join: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' }
    });
    const [benefits, setBenefits] = useState([]);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: sectionsData } = await supabase.from('participants_sections').select('*');
            const { data: benefitsData } = await supabase.from('participants_benefits').select('*').order('sort_order', { ascending: true });
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

    const handleBenefitChange = (id, field, value) => {
        const targetField = (field === 'title' || field === 'description') ? getFieldName(field) : field;
        setBenefits(prev => prev.map(item => item.id === id ? { ...item, [targetField]: value } : item));
    };

    const handleStepChange = (id, field, value) => {
        const targetField = (field === 'title' || field === 'description') ? getFieldName(field) : field;
        setSteps(prev => prev.map(item => item.id === id ? { ...item, [targetField]: value } : item));
    };

    const addNewBenefit = () => {
        const newBenefit = {
            id: `temp-${Date.now()}`,
            icon: 'CheckCircle',
            title: 'Новое преимущество',
            description: 'Описание преимущества...',
            title_uz: '', description_uz: '', title_en: '', description_en: '',
            sort_order: benefits.length + 1
        };
        setBenefits([...benefits, newBenefit]);
    };

    const addNewStep = () => {
        const newStep = {
            id: `temp-${Date.now()}`,
            step_num: steps.length + 1,
            title: 'Новый шаг',
            description: 'Описание шага...',
            title_uz: '', description_uz: '', title_en: '', description_en: '',
            sort_order: steps.length + 1
        };
        setSteps([...steps, newStep]);
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

            // Benefits
            const { data: dbBenefits } = await supabase.from('participants_benefits').select('id');
            const localBenefitIds = benefits.filter(b => typeof b.id === 'number').map(b => b.id);
            const benefitsToDelete = dbBenefits?.filter(b => !localBenefitIds.includes(b.id)).map(b => b.id) || [];
            if (benefitsToDelete.length > 0) await supabase.from('participants_benefits').delete().in('id', benefitsToDelete);

            for (const item of benefits) {
                const prepared = { ...item };
                if (typeof prepared.id === 'string' && prepared.id.startsWith('temp-')) delete prepared.id;
                await supabase.from('participants_benefits').upsert(prepared);
            }

            // Steps
            const { data: dbSteps } = await supabase.from('participants_steps').select('id');
            const localStepIds = steps.filter(s => typeof s.id === 'number').map(s => s.id);
            const stepsToDelete = dbSteps?.filter(s => !localStepIds.includes(s.id)).map(s => s.id) || [];
            if (stepsToDelete.length > 0) await supabase.from('participants_steps').delete().in('id', stepsToDelete);

            for (const item of steps) {
                const prepared = { ...item };
                if (typeof prepared.id === 'string' && prepared.id.startsWith('temp-')) delete prepared.id;
                await supabase.from('participants_steps').upsert(prepared);
            }

            showNotification('success', 'Все изменения успешно сохранены!');
            await fetchData();

        } catch (error) {
            console.error(error);
            showNotification('error', 'Ошибка сохранения. Убедитесь, что таблицы созданы.');
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
            <p style={{ color: '#64748b', fontWeight: 500 }}>Загрузка редактора...</p>
        </div>
    );

    return (
        <div className="admin-page" style={{ paddingBottom: '120px' }}>
            <div className="admin-page-header">
                <div>
                    <h2>Редактор "Участники"</h2>
                    <p>Управление страницей для участников.</p>
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
                    <span className="section-label-badge">{activeLang}</span>
                </div>
                <div className="form-grid">
                    <div>
                        <span className="input-label">Заголовок страницы</span>
                        <input
                            type="text"
                            value={sections.hero[getFieldName('title')] || ''}
                            onChange={(e) => handleSectionChange('hero', 'title', e.target.value)}
                            placeholder="Например: Стать участником"
                        />
                    </div>
                    <div>
                        <span className="input-label">Описание</span>
                        <textarea
                            value={sections.hero[getFieldName('description')] || ''}
                            onChange={(e) => handleSectionChange('hero', 'description', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className="section-label">
                        <Users size={24} color="#2563eb" />
                        Преимущества участия
                    </div>
                    <button onClick={addNewBenefit} className="btn-secondary">
                        <Plus size={18} /> Добавить
                    </button>
                </div>
                <div className="form-grid">
                    {benefits.map((benefit, i) => (
                        <div key={benefit.id} className="list-item">
                            <div className="list-item-header">
                                <span className="item-number">Преимущество #{i + 1}</span>
                                <div className="item-controls">
                                    <button className="control-btn" onClick={() => moveItem(benefits, setBenefits, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                    <button className="control-btn" onClick={() => moveItem(benefits, setBenefits, i, 1)} disabled={i === benefits.length - 1}><MoveDown size={16} /></button>
                                    <button className="control-btn delete" onClick={() => removeItem(benefits, setBenefits, benefit.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '200px 1fr 2fr', gap: '24px', marginTop: 10 }}>
                                <div>
                                    <span className="input-label">Иконка</span>
                                    <IconPicker value={benefit.icon || 'Star'} onChange={(v) => handleBenefitChange(benefit.id, 'icon', v)} />
                                </div>
                                <div>
                                    <span className="input-label">Заголовок ({activeLang})</span>
                                    <input value={benefit[getFieldName('title')] || ''} onChange={(e) => handleBenefitChange(benefit.id, 'title', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Описание ({activeLang})</span>
                                    <textarea value={benefit[getFieldName('description')] || ''} onChange={(e) => handleBenefitChange(benefit.id, 'description', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Steps Section */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className="section-label">
                        <Target size={24} color="#2563eb" />
                        Как вступить (Шаги)
                    </div>
                    <button onClick={addNewStep} className="btn-secondary">
                        <Plus size={18} /> Добавить шаг
                    </button>
                </div>
                <div className="form-grid">
                    {steps.map((step, i) => (
                        <div key={step.id} className="list-item">
                            <div className="list-item-header">
                                <span className="item-number">Шаг {step.step_num || i + 1}</span>
                                <div className="item-controls">
                                    <button className="control-btn" onClick={() => moveItem(steps, setSteps, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                    <button className="control-btn" onClick={() => moveItem(steps, setSteps, i, 1)} disabled={i === steps.length - 1}><MoveDown size={16} /></button>
                                    <button className="control-btn delete" onClick={() => removeItem(steps, setSteps, step.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '24px', marginTop: 10 }}>
                                <div>
                                    <span className="input-label">Заголовок ({activeLang})</span>
                                    <input value={step[getFieldName('title')] || ''} onChange={(e) => handleStepChange(step.id, 'title', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Описание ({activeLang})</span>
                                    <textarea value={step[getFieldName('description')] || ''} onChange={(e) => handleStepChange(step.id, 'description', e.target.value)} />
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

export default AdminParticipants;
