import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, MoveUp, MoveDown, Globe, Image as ImageIcon, Tag, Clock, Calendar, BarChart3 } from 'lucide-react';
import '../../pages/admin/Admin.css';
import IconPicker from '../../components/admin/IconPicker';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminNews = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeLang, setActiveLang] = useState('ru');

    const [sections, setSections] = useState({
        hero: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        header: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        newsletter: {
            title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '',
            cta_button: '', cta_button_uz: '', cta_button_en: '',
            cta_placeholder: '', cta_placeholder_uz: '', cta_placeholder_en: '',
            is_active: true
        },
        stats_section: { title: 'Секция статистики', is_active: true }
    });

    const [stats, setStats] = useState([]);
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: sectionsData } = await supabase.from('news_sections').select('*');
            const { data: statsData } = await supabase.from('news_stats').select('*').order('sort_order', { ascending: true });
            const { data: newsData } = await supabase.from('news_items').select('*').order('sort_order', { ascending: true });

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
            if (newsData) setNews(newsData);
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
        if (field === 'is_active') {
            setSections(prev => ({
                ...prev,
                [key]: { ...prev[key], is_active: value }
            }));
            return;
        }
        const targetField = getFieldName(field);
        setSections(prev => ({
            ...prev,
            [key]: { ...prev[key], [targetField]: value }
        }));
    };

    const handleFileUpload = async (file, id) => {
        if (!file) return;
        try {
            setSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `news/${fileName}`;
            let { error: uploadError } = await supabase.storage.from('projects').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('projects').getPublicUrl(filePath);
            setNews(prev => prev.map(n => n.id === id ? { ...n, image_url: publicUrl } : n));
            showNotification('success', 'Изображение загружено!');
        } catch (error) {
            console.error(error);
            showNotification('error', 'Ошибка загрузки.');
        } finally {
            setSaving(false);
        }
    };

    const handleItemChange = (list, setList, id, field, value) => {
        const localizedFields = ['title', 'excerpt', 'description', 'category', 'read_time', 'label'];
        const targetField = localizedFields.includes(field) ? getFieldName(field) : field;
        setList(prev => prev.map(item => item.id === id ? { ...item, [targetField]: value } : item));
    };

    const addNewItem = (type) => {
        let newItem = { id: `temp-${Date.now()}`, sort_order: 0 };
        if (type === 'stats') {
            newItem = { ...newItem, value: '0', label: 'Показатель', sort_order: stats.length + 1 };
            setStats([...stats, newItem]);
        } else if (type === 'news') {
            newItem = {
                ...newItem,
                title: 'Заголовок новости',
                excerpt: '',
                description: '',
                category: 'Событие',
                date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'Short', year: 'numeric' }),
                read_time: '5 мин',
                image_url: '',
                sort_order: news.length + 1,
                is_active: true
            };
            setNews([...news, newItem]);
        }
    };

    const removeItem = (list, setList, id) => setList(list.filter(item => item.id !== id));

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
                await supabase.from('news_sections').upsert({ key, ...sections[key] });
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
            await syncList('news_stats', stats);
            await syncList('news_items', news);
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

    if (loading) return <div className="admin-page"><Loader className="spin" /></div>;

    return (
        <div className="admin-page" style={{ paddingBottom: '120px' }}>
            <AdminPageHeader
                title='Новости и События'
                subtitle='Публикуйте новости и анонсы событий.'
                activeLang={activeLang}
                setActiveLang={setActiveLang}
            />

            {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            <div className="edit-section">
                <div className="section-label"><Globe /> Hero</div>
                <input placeholder="Заголовок" value={sections.hero[getFieldName('title')] || ''} onChange={(e) => handleSectionChange('hero', 'title', e.target.value)} />
                <textarea placeholder="Описание" value={sections.hero[getFieldName('description')] || ''} onChange={(e) => handleSectionChange('hero', 'description', e.target.value)} />
            </div>

            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="section-label"><Calendar /> Рассылка</div>
                    <label className="switch-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={sections.newsletter?.is_active !== false} onChange={(e) => handleSectionChange('newsletter', 'is_active', e.target.checked)} />
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{sections.newsletter?.is_active !== false ? 'Включена' : 'Отключена'}</span>
                    </label>
                </div>
                <div style={{ display: 'grid', gap: '15px', opacity: sections.newsletter?.is_active !== false ? 1 : 0.5, pointerEvents: sections.newsletter?.is_active !== false ? 'auto' : 'none' }}>
                    <input
                        placeholder="Заголовок блока"
                        value={sections.newsletter[getFieldName('title')] || ''}
                        onChange={(e) => handleSectionChange('newsletter', 'title', e.target.value)}
                    />
                    <textarea
                        placeholder="Описание блока"
                        value={sections.newsletter[getFieldName('description')] || ''}
                        onChange={(e) => handleSectionChange('newsletter', 'description', e.target.value)}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <span className="input-label">Текст на кнопке ({activeLang})</span>
                            <input
                                placeholder="Подписаться"
                                value={sections.newsletter[getFieldName('cta_button')] || ''}
                                onChange={(e) => handleSectionChange('newsletter', 'cta_button', e.target.value)}
                            />
                        </div>
                        <div>
                            <span className="input-label">Placeholder инпута ({activeLang})</span>
                            <input
                                placeholder="Введите ваш email"
                                value={sections.newsletter[getFieldName('cta_placeholder')] || ''}
                                onChange={(e) => handleSectionChange('newsletter', 'cta_placeholder', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="section-label"><BarChart3 size={20} /> Статистика</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <label className="switch-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={sections.stats_section?.is_active !== false} onChange={(e) => handleSectionChange('stats_section', 'is_active', e.target.checked)} />
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{sections.stats_section?.is_active !== false ? 'Включена' : 'Отключена'}</span>
                        </label>
                        <button onClick={() => addNewItem('stats')} className="btn-secondary" disabled={sections.stats_section?.is_active === false}><Plus size={16} /> Добавить</button>
                    </div>
                </div>
                <div className="stats-admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px', opacity: sections.stats_section?.is_active !== false ? 1 : 0.5, pointerEvents: sections.stats_section?.is_active !== false ? 'auto' : 'none' }}>
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

            <div className="edit-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div className="section-label"><Tag /> Новости</div>
                    <button onClick={() => addNewItem('news')} className="btn-secondary">Добавить новость</button>
                </div>
                {news.map((item, i) => (
                    <div key={item.id} className="list-item">
                        <div className="list-item-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span>Новость #{i + 1}</span>
                                <label className="switch-container" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginLeft: '12px' }}>
                                    <input type="checkbox" checked={item.is_active !== false} onChange={(e) => handleItemChange(news, setNews, item.id, 'is_active', e.target.checked)} />
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: item.is_active !== false ? '#10b981' : '#ef4444' }}>
                                        {item.is_active !== false ? 'АКТИВНА' : 'СКРЫТА'}
                                    </span>
                                </label>
                            </div>
                            <div className="item-controls">
                                <button className="control-btn" onClick={() => moveItem(news, setNews, i, -1)} disabled={i === 0}><MoveUp size={16} /></button>
                                <button className="control-btn" onClick={() => moveItem(news, setNews, i, 1)} disabled={i === news.length - 1}><MoveDown size={16} /></button>
                                <button className="control-btn delete" onClick={() => removeItem(news, setNews, item.id)}><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                            <div className="image-upload-preview">
                                <span className="input-label">Изображение</span>
                                <input type="file" accept="image/*" id={`img-${item.id}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files[0], item.id)} />
                                <label htmlFor={`img-${item.id}`} className="btn-secondary" style={{ width: '100%', cursor: 'pointer', textAlign: 'center' }}>Выбрать фото</label>
                                {item.image_url && <img src={item.image_url} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }} />}
                            </div>
                            <div className="news-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <span className="input-label">Заголовок ({activeLang})</span>
                                    <input value={item[getFieldName('title')] || ''} onChange={(e) => handleItemChange(news, setNews, item.id, 'title', e.target.value)} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <span className="input-label">Краткий текст (excerpt) ({activeLang})</span>
                                    <input value={item[getFieldName('excerpt')] || ''} onChange={(e) => handleItemChange(news, setNews, item.id, 'excerpt', e.target.value)} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <span className="input-label">Полный текст ({activeLang})</span>
                                    <textarea value={item[getFieldName('description')] || ''} onChange={(e) => handleItemChange(news, setNews, item.id, 'description', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Категория ({activeLang})</span>
                                    <input value={item[getFieldName('category')] || ''} onChange={(e) => handleItemChange(news, setNews, item.id, 'category', e.target.value)} />
                                </div>
                                <div>
                                    <span className="input-label">Дата</span>
                                    <input value={item.date || ''} onChange={(e) => handleItemChange(news, setNews, item.id, 'date', e.target.value)} />
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

export default AdminNews;
