import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, MoveUp, MoveDown, Globe, Image as ImageIcon, Book, BarChart3, Sparkles, FileText, Download, Eye } from 'lucide-react';
import '../../pages/admin/Admin.css';
import IconPicker from '../../components/admin/IconPicker';

const AdminKnowledge = () => {
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
    const [resources, setResources] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: sectionsData } = await supabase.from('knowledge_sections').select('*');
            const { data: statsData } = await supabase.from('knowledge_stats').select('*').order('sort_order', { ascending: true });
            const { data: resourcesData } = await supabase.from('knowledge_items').select('*').order('sort_order', { ascending: true });

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
            if (resourcesData) setResources(resourcesData);

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

    const handleFileUpload = async (file, id, field) => {
        if (!file) return;
        try {
            setSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `knowledge/${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('projects')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('projects')
                .getPublicUrl(filePath);

            setResources(prev => prev.map(r => r.id === id ? { ...r, [field]: publicUrl } : r));
            showNotification('success', 'Файл загружен!');
        } catch (error) {
            console.error(error);
            showNotification('error', 'Ошибка загрузки.');
        } finally {
            setSaving(false);
        }
    };

    const handleItemChange = (list, setList, id, field, value) => {
        const localizedFields = ['title', 'description', 'type', 'category', 'pages', 'label'];
        const targetField = localizedFields.includes(field) ? getFieldName(field) : field;
        setList(prev => prev.map(item => item.id === id ? { ...item, [targetField]: value } : item));
    };

    const addNewItem = (type) => {
        let newItem = { id: `temp-${Date.now()}`, sort_order: 0 };
        if (type === 'stats') {
            newItem = { ...newItem, value: '0', label: 'Показатель', sort_order: stats.length + 1 };
            setStats([...stats, newItem]);
        } else if (type === 'resources') {
            newItem = {
                ...newItem,
                title: 'Новый ресурс',
                description: '',
                type: 'PDF',
                category: '',
                size: '',
                pages: '',
                date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'Short', year: 'numeric' }),
                downloads: '0',
                image_url: '',
                file_url: '',
                sort_order: resources.length + 1
            };
            setResources([...resources, newItem]);
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
        try {
            for (const key of Object.keys(sections)) {
                await supabase.from('knowledge_sections').upsert({ key, ...sections[key] });
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

            await syncList('knowledge_stats', stats);
            await syncList('knowledge_items', resources);
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
        { code: 'ru', label: 'RU', flag: '🇷🇺' },
        { code: 'uz', label: 'UZ', flag: '🇺🇿' },
        { code: 'en', label: 'EN', flag: '🇬🇧' }
    ];

    if (loading) return <div className="admin-page"><Loader className="spin" size={40} /></div>;

    return (
        <div className="admin-page" style={{ paddingBottom: '120px' }}>
            <div className="admin-page-header">
                <div>
                    <h2>База Знаний</h2>
                    <p>Управляйте образовательными ресурсами и документами.</p>
                </div>
                <div className="flex gap-2">
                    {languages.map(lang => (
                        <button key={lang.code} onClick={() => setActiveLang(lang.code)} className={`px-4 py-1 rounded-lg ${activeLang === lang.code ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            {lang.code.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            {/* Hero */}
            <div className="edit-section">
                <div className="section-label"><Globe /> Hero</div>
                <div className="form-grid">
                    <input placeholder="Заголовок" value={sections.hero[getFieldName('title')] || ''} onChange={(e) => handleSectionChange('hero', 'title', e.target.value)} />
                    <textarea placeholder="Описание" value={sections.hero[getFieldName('description')] || ''} onChange={(e) => handleSectionChange('hero', 'description', e.target.value)} />
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

            {/* Resources */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div className="section-label"><Book /> Ресурсы</div>
                    <button onClick={() => addNewItem('resources')} className="btn-secondary">Добавить ресурс</button>
                </div>

                {resources.map((r, i) => (
                    <div key={r.id} className="list-item">
                        <div className="list-item-header">
                            <span className="item-number">Ресурс #{i + 1}</span>
                            <div className="item-controls">
                                <button className="control-btn" onClick={() => moveItem(resources, setResources, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                <button className="control-btn" onClick={() => moveItem(resources, setResources, i, 1)} disabled={i === resources.length - 1}><MoveDown size={16} /></button>
                                <button className="control-btn delete" onClick={() => removeItem(resources, setResources, r.id)}><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                            <div className="image-upload-preview" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                <span className="input-label">Обложка</span>
                                <input type="file" accept="image/*" id={`img-${r.id}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files[0], r.id, 'image_url')} />
                                <label htmlFor={`img-${r.id}`} className="btn-secondary" style={{ width: '100%', cursor: 'pointer', textAlign: 'center' }}>Выбрать фото</label>
                                {r.image_url && <img src={r.image_url} alt="Preview" style={{ width: '100%', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }} />}

                                <div style={{ marginTop: '15px' }}>
                                    <span className="input-label">Файл (PDF/и др.)</span>
                                    <input type="file" id={`file-${r.id}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files[0], r.id, 'file_url')} />
                                    <label htmlFor={`file-${r.id}`} className="btn-secondary" style={{ width: '100%', cursor: 'pointer', textAlign: 'center' }}>Загрузить файл</label>
                                    {r.file_url && <div style={{ fontSize: '10px', marginTop: '5px', wordBreak: 'break-all' }}>{r.file_url}</div>}
                                </div>
                            </div>

                            <div className="resource-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <span className="input-label">Название ({activeLang})</span>
                                    <input value={r[getFieldName('title')] || ''} onChange={(e) => handleItemChange(resources, setResources, r.id, 'title', e.target.value)} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <span className="input-label">Описание ({activeLang})</span>
                                    <textarea value={r[getFieldName('description')] || ''} onChange={(e) => handleItemChange(resources, setResources, r.id, 'description', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Тип (PDF, Курс...) ({activeLang})</span>
                                    <input value={r[getFieldName('type')] || ''} onChange={(e) => handleItemChange(resources, setResources, r.id, 'type', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Категория ({activeLang})</span>
                                    <input value={r[getFieldName('category')] || ''} onChange={(e) => handleItemChange(resources, setResources, r.id, 'category', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Размер (напр. 2.4 MB)</span>
                                    <input value={r.size || ''} onChange={(e) => handleItemChange(resources, setResources, r.id, 'size', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Объем (стр/модулей) ({activeLang})</span>
                                    <input value={r[getFieldName('pages')] || ''} onChange={(e) => handleItemChange(resources, setResources, r.id, 'pages', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="save-bars">
                <button onClick={saveAll} disabled={saving} className="btn-primary" style={{ minWidth: '300px' }}>
                    {saving ? 'Сохранение...' : 'Сохранить все изменения'}
                </button>
            </div>
        </div>
    );
};

export default AdminKnowledge;
