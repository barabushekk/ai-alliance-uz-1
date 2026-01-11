import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, MoveUp, MoveDown, Globe, Image as ImageIcon, Users, BarChart3, Sparkles, Layout } from 'lucide-react';
import '../../pages/admin/Admin.css';
import IconPicker from '../../components/admin/IconPicker';

const AdminGroups = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeLang, setActiveLang] = useState('ru');

    const [sections, setSections] = useState({
        hero: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        header: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        cta: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '', cta_text: '', cta_text_uz: '', cta_text_en: '', cta_link: '' }
    });

    const [stats, setStats] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: sectionsData } = await supabase.from('groups_sections').select('*');
            const { data: statsData } = await supabase.from('groups_stats').select('*').order('sort_order', { ascending: true });
            const { data: groupsData } = await supabase.from('groups_items').select('*').order('sort_order', { ascending: true });

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
            if (groupsData) setGroups(groupsData);

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
            const filePath = `groups/${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('projects') // Using same bucket for simplicity or create 'groups'
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('projects')
                .getPublicUrl(filePath);

            setGroups(prev => prev.map(g => g.id === id ? { ...g, image_url: publicUrl } : g));
            showNotification('success', 'Изображение загружено!');
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('error', `Ошибка загрузки: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleItemChange = (list, setList, id, field, value) => {
        const localizedFields = ['name', 'leads', 'focus', 'objectives', 'members', 'meetings', 'label'];
        const targetField = localizedFields.includes(field) ? getFieldName(field) : field;
        setList(prev => prev.map(item => item.id === id ? { ...item, [targetField]: value } : item));
    };

    const addNewItem = (type) => {
        let newItem = { id: `temp-${Date.now()}`, sort_order: 0 };

        if (type === 'stats') {
            newItem = { ...newItem, value: '0', label: 'Показатель', sort_order: stats.length + 1 };
            setStats([...stats, newItem]);
        } else if (type === 'groups') {
            newItem = {
                ...newItem,
                name: 'Новый комитет',
                leads: '',
                focus: '',
                objectives: '',
                members: '',
                meetings: '',
                image_url: '',
                sort_order: groups.length + 1
            };
            setGroups([...groups, newItem]);
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
            for (const key of Object.keys(sections)) {
                await supabase.from('groups_sections').upsert({ key, ...sections[key] });
            }

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

            await syncList('groups_stats', stats);
            await syncList('groups_items', groups);

            showNotification('success', 'Все изменения сохранены!');
            await fetchData();
        } catch (error) {
            console.error(error);
            showNotification('error', 'Ошибка сохранения.');
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
            <p>Загрузка редактора комитетов...</p>
        </div>
    );

    return (
        <div className="admin-page" style={{ paddingBottom: '120px' }}>
            <div className="admin-page-header">
                <div>
                    <h2>Редактор Комитетов</h2>
                    <p>Управляйте рабочими группами и их составом.</p>
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
                                border: 'none', borderRadius: '8px', cursor: 'pointer'
                            }}
                        >
                            {lang.code.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            {/* Hero */}
            <div className="edit-section">
                <div className="section-label"><Globe size={20} /> Hero Секция</div>
                <div className="form-grid">
                    <div>
                        <span className="input-label">Заголовок ({activeLang})</span>
                        <input value={sections.hero[getFieldName('title')] || ''} onChange={(e) => handleSectionChange('hero', 'title', e.target.value)} />
                    </div>
                    <div>
                        <span className="input-label">Описание ({activeLang})</span>
                        <textarea value={sections.hero[getFieldName('description')] || ''} onChange={(e) => handleSectionChange('hero', 'description', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="section-label"><BarChart3 size={20} /> Статистика</div>
                    <button onClick={() => addNewItem('stats')} className="btn-secondary"><Plus size={16} /> Добавить</button>
                </div>
                <div className="stats-admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                    {stats.map((s, i) => (
                        <div key={s.id} className="list-item" style={{ padding: '15px' }}>
                            <div className="item-controls" style={{ float: 'right' }}>
                                <button className="control-btn delete" onClick={() => removeItem(stats, setStats, s.id)}><Trash2 size={16} /></button>
                            </div>
                            <div>
                                <span className="input-label">Значение</span>
                                <input value={s.value || ''} onChange={(e) => handleItemChange(stats, setStats, s.id, 'value', e.target.value)} />
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <span className="input-label">Подпись ({activeLang})</span>
                                <input value={s[getFieldName('label')] || ''} onChange={(e) => handleItemChange(stats, setStats, s.id, 'label', e.target.value)} />
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <span className="input-label">Иконка</span>
                                <IconPicker value={s.icon_name || ''} onChange={(val) => handleItemChange(stats, setStats, s.id, 'icon_name', val)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Groups */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="section-label"><Users size={20} /> Список Комитетов</div>
                    <button onClick={() => addNewItem('groups')} className="btn-secondary"><Plus size={16} /> Добавить комитет</button>
                </div>
                <div className="form-grid">
                    <div style={{ marginBottom: '1rem' }}>
                        <span className="input-label">Заголовок списка ({activeLang})</span>
                        <input value={sections.header[getFieldName('title')] || ''} onChange={(e) => handleSectionChange('header', 'title', e.target.value)} />
                    </div>

                    {groups.map((g, i) => (
                        <div key={g.id} className="list-item">
                            <div className="list-item-header">
                                <span className="item-number">Комитет #{i + 1}</span>
                                <div className="item-controls">
                                    <button className="control-btn" onClick={() => moveItem(groups, setGroups, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                    <button className="control-btn" onClick={() => moveItem(groups, setGroups, i, 1)} disabled={i === groups.length - 1}><MoveDown size={16} /></button>
                                    <button className="control-btn delete" onClick={() => removeItem(groups, setGroups, g.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                                <div className="image-upload-preview" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <input type="file" accept="image/*" id={`file-${g.id}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files[0], g.id)} />
                                    <label htmlFor={`file-${g.id}`} className="btn-secondary" style={{ width: '100%', cursor: 'pointer', textAlign: 'center' }}>Выбрать фото</label>
                                    {g.image_url && <img src={g.image_url} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                                </div>

                                <div className="group-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <span className="input-label">Название ({activeLang})</span>
                                        <input value={g[getFieldName('name')] || ''} onChange={(e) => handleItemChange(groups, setGroups, g.id, 'name', e.target.value)} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <span className="input-label">Руководители ({activeLang})</span>
                                        <input value={g[getFieldName('leads')] || ''} onChange={(e) => handleItemChange(groups, setGroups, g.id, 'leads', e.target.value)} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <span className="input-label">Фокус/Направление ({activeLang})</span>
                                        <textarea value={g[getFieldName('focus')] || ''} onChange={(e) => handleItemChange(groups, setGroups, g.id, 'focus', e.target.value)} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <span className="input-label">Ключевые задачи (каждая с новой строки) ({activeLang})</span>
                                        <textarea value={g[getFieldName('objectives')] || ''} onChange={(e) => handleItemChange(groups, setGroups, g.id, 'objectives', e.target.value)} />
                                    </div>
                                    <div>
                                        <span className="input-label">Участники ({activeLang})</span>
                                        <input value={g[getFieldName('members')] || ''} onChange={(e) => handleItemChange(groups, setGroups, g.id, 'members', e.target.value)} />
                                    </div>
                                    <div>
                                        <span className="input-label">Встречи ({activeLang})</span>
                                        <input value={g[getFieldName('meetings')] || ''} onChange={(e) => handleItemChange(groups, setGroups, g.id, 'meetings', e.target.value)} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <span className="input-label">Иконка</span>
                                        <IconPicker value={g.icon_name || ''} onChange={(val) => handleItemChange(groups, setGroups, g.id, 'icon_name', val)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="edit-section">
                <div className="section-label"><Sparkles size={20} /> CTA Блок</div>
                <div className="form-grid">
                    <div>
                        <span className="input-label">Заголовок ({activeLang})</span>
                        <input value={sections.cta[getFieldName('title')] || ''} onChange={(e) => handleSectionChange('cta', 'title', e.target.value)} />
                    </div>
                    <div>
                        <span className="input-label">Описание ({activeLang})</span>
                        <textarea value={sections.cta[getFieldName('description')] || ''} onChange={(e) => handleSectionChange('cta', 'description', e.target.value)} />
                    </div>
                    <div>
                        <span className="input-label">Текст кнопки ({activeLang})</span>
                        <input value={sections.cta[getFieldName('cta_text')] || ''} onChange={(e) => handleSectionChange('cta', 'cta_text', e.target.value)} />
                    </div>
                    <div>
                        <span className="input-label">Ссылка кнопки</span>
                        <input value={sections.cta.cta_link || ''} onChange={(e) => handleSectionChange('cta', 'cta_link', e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="save-bars">
                <button onClick={saveAll} disabled={saving} className="btn-primary" style={{ minWidth: '300px' }}>
                    {saving ? <Loader className="spin" size={24} /> : <Save size={24} />}
                    {saving ? 'Сохранение...' : 'Сохранить все изменения'}
                </button>
            </div>
        </div>
    );
};

export default AdminGroups;
