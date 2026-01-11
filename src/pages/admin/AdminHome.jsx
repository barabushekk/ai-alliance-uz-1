import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, MoveUp, MoveDown, ChevronDown, ChevronRight, Upload, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import IconPicker from '../../components/admin/IconPicker';

const AdminHome = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeLang, setActiveLang] = useState('ru');
    const [expandedSections, setExpandedSections] = useState({
        hero: true,
        about: false,
        projects: false,
        committees: false,
        features: false,
        partners: false,
        mission: false,
        pages: false
    });

    const [pages, setPages] = useState([]);

    // Hero section data
    const [hero, setHero] = useState({
        title: 'Альянс в сфере искусственного интеллекта',
        description: 'Мы объединяем технологические компании для развития рынка ИИ, совершенствования законодательной базы и подготовки кадров.',
        card_label: 'Документ',
        card_title: 'Национальная стратегия развития ИИ до 2030 года',
        card_text: 'Ключевые показатели и дорожная карта внедрения технологий в экономику.',
        footer_title: 'Исследование 2025:',
        footer_desc: 'Тренды генеративных моделей в Центральной Азии',
        card_link: '',
        footer_link: '',
        background_url: '',
        background_type: 'video',
        document_url: '',
        title_uz: '', description_uz: '', card_label_uz: '', card_title_uz: '', card_text_uz: '', card_link_uz: '', footer_title_uz: '', footer_desc_uz: '', footer_link_uz: '',
        title_en: '', description_en: '', card_label_en: '', card_title_en: '', card_text_en: '', card_link_en: '', footer_title_en: '', footer_desc_en: '', footer_link_en: ''
    });

    const [sections, setSections] = useState({
        about_preview: { title: 'Интеллектуальный потенциал цифровой экономики', description: 'Альянс объединяет ведущие технологические компании для развития рынка ИИ в Узбекистане...', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        projects_heading: { title: 'Ключевые проекты', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        wg_heading: { title: 'Экспертиза и стандарты', description: 'Мы разрабатываем фундамент для безопасного и этичного ИИ...', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        feature_main: { title: 'Роль технологий ИИ в развитии компании сегодня', description: 'Технологии ИИ существенно трансформируют деятельность компаний...', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        feature_exp: { title: 'ОПЫТ ПРИМЕНЕНИЯ', description: 'Альянс создал и активно развивает проект AI Russia...', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        mission_left: { title: 'Миссия', description: 'Быть центром развития искусственного интеллекта в регионе...', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        mission_right: { title: 'Альянс — открытая структура', description: 'Для развития искусственного интеллекта необходимо объединять усилия...', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        home_cta: { title: 'Стать участником', title_uz: '', title_en: '' }
    });

    const [items, setItems] = useState({
        projects: [],
        working_groups: [],
        feature_advantages: [],
        partners: [],
        about_stats: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: sectionsData } = await supabase.from('home_sections').select('*');
            const { data: itemsData } = await supabase.from('home_items').select('*').order('sort_order', { ascending: true });
            const { data: heroData } = await supabase.from('hero_section').select('*').single();

            if (heroData) setHero(heroData);
            if (sectionsData) {
                const newSections = { ...sections };
                sectionsData.forEach(item => {
                    newSections[item.key] = item;
                });
                setSections(newSections);
            }

            if (itemsData) {
                const { data: statsData } = await supabase.from('about_stats').select('*').order('sort_order', { ascending: true });
                setItems({
                    projects: itemsData.filter(i => i.section_key === 'projects'),
                    working_groups: itemsData.filter(i => i.section_key === 'working_groups'),
                    feature_advantages: itemsData.filter(i => i.section_key === 'feature_advantages'),
                    partners: itemsData.filter(i => i.section_key === 'partners'),
                    about_stats: statsData || [],
                });
            }

            const { data: pagesData } = await supabase.from('site_pages').select('*').order('sort_order', { ascending: true });
            if (pagesData) setPages(pagesData);
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

    const handleHeroChange = (field, value) => {
        const targetField = getFieldName(field);
        setHero(prev => ({ ...prev, [targetField]: value }));
    };

    const handleSectionChange = (key, field, value) => {
        const targetField = getFieldName(field);
        setSections(prev => ({
            ...prev,
            [key]: { ...prev[key], [targetField]: value }
        }));
    };

    const handleFileUpload = async (file, bucket, field) => {
        if (!file) return;

        // Size validation (30MB for background)
        const maxSize = 30 * 1024 * 1024;
        if (file.size > maxSize) {
            showNotification('error', 'Файл слишком большой. Максимум 30МБ.');
            return;
        }

        try {
            setSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `hero/${fileName}`;

            let { error: uploadError, data } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            setHero(prev => ({ ...prev, [field]: publicUrl }));
            showNotification('success', 'Файл успешно загружен!');
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('error', `Ошибка загрузки: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleItemFileUpload = async (file, sectionKey, itemId, field) => {
        if (!file) return;

        try {
            setSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${sectionKey}/${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('hero-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('hero-assets')
                .getPublicUrl(filePath);

            handleItemChange(sectionKey, itemId, field, publicUrl);
            showNotification('success', 'Файл загружен!');
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('error', `Ошибка загрузки: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleItemChange = (sectionKey, id, field, value) => {
        const targetField = (field === 'title' || field === 'description' || field === 'label') ? getFieldName(field) : field;
        setItems(prev => ({
            ...prev,
            [sectionKey]: prev[sectionKey].map(item => item.id === id ? { ...item, [targetField]: value } : item)
        }));
    };

    const addNewItem = (sectionKey) => {
        const newItem = {
            id: `temp-${Date.now()}`,
            section_key: sectionKey,
            title: sectionKey === 'about_stats' ? '' : 'Новый элемент',
            label: '',
            value: '',
            description: '',
            title_uz: '', title_en: '',
            label_uz: '', label_en: '',
            description_uz: '', description_en: '',
            icon: 'Globe',
            sort_order: items[sectionKey].length + 1
        };
        setItems(prev => ({
            ...prev,
            [sectionKey]: [...prev[sectionKey], newItem]
        }));
    };

    const removeItem = (sectionKey, id) => {
        setItems(prev => ({
            ...prev,
            [sectionKey]: prev[sectionKey].filter(i => i.id !== id)
        }));
    };

    const moveItem = (sectionKey, index, direction) => {
        const newList = [...items[sectionKey]];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newList.length) return;

        [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
        newList.forEach((item, i) => item.sort_order = i + 1);
        setItems(prev => ({ ...prev, [sectionKey]: newList }));
    };

    const saveAll = async () => {
        setSaving(true);
        setNotification(null);
        try {
            // Save Hero
            await supabase.from('hero_section').upsert(hero);

            // 2. Save Sections (Batch)
            const sectionEntries = Object.keys(sections).map(key => ({
                key,
                ...sections[key]
            }));

            if (sectionEntries.length > 0) {
                const { error: sectionsError } = await supabase.from('home_sections').upsert(sectionEntries);
                if (sectionsError) throw sectionsError;
            }

            // 1. Save Items cleanup (Delete removed items)
            const { data: dbItems } = await supabase.from('home_items').select('id');
            const homeItemKeysForCleanup = ['projects', 'working_groups', 'feature_advantages', 'partners'];
            const currentLocalItems = homeItemKeysForCleanup.reduce((acc, key) => [...acc, ...(items[key] || [])], []);

            const localIds = currentLocalItems
                .filter(i => i.id && !String(i.id).startsWith('temp-'))
                .map(i => i.id);

            const toDelete = dbItems.filter(db => !localIds.includes(db.id)).map(db => db.id);

            if (toDelete.length > 0) {
                await supabase.from('home_items').delete().in('id', toDelete);
            }

            // 3. Save Items (Batch for home_items)
            const homeItemKeys = ['projects', 'working_groups', 'feature_advantages', 'partners'];
            const allItems = homeItemKeys.reduce((acc, key) => [...acc, ...(items[key] || [])], []);

            const preparedItems = allItems.map(item => {
                const prepared = {
                    id: typeof item.id === 'string' && item.id.startsWith('temp-') ? undefined : item.id,
                    section_key: item.section_key,
                    title: item.title,
                    description: item.description,
                    title_uz: item.title_uz,
                    description_uz: item.description_uz,
                    title_en: item.title_en,
                    description_en: item.description_en,
                    icon: item.icon,
                    sort_order: item.sort_order,
                    image_url: item.image_url
                };
                if (prepared.id === undefined) delete prepared.id;
                return prepared;
            });

            if (preparedItems.length > 0) {
                const { error: itemsError } = await supabase.from('home_items').upsert(preparedItems);
                if (itemsError) throw itemsError;
            }

            // 4. Save Stats (Batch)
            const { data: dbStats } = await supabase.from('about_stats').select('id');
            const localStatIds = items.about_stats.filter(i => typeof i.id === 'number' || (typeof i.id === 'string' && !i.id.startsWith('temp-'))).map(i => i.id);
            const statsToDelete = dbStats.filter(db => !localStatIds.includes(db.id)).map(db => db.id);

            if (statsToDelete.length > 0) {
                const { error: delStatsError } = await supabase.from('about_stats').delete().in('id', statsToDelete);
                if (delStatsError) throw delStatsError;
            }

            const preparedStats = items.about_stats.map(stat => {
                const prepared = {
                    id: typeof stat.id === 'string' && stat.id.startsWith('temp-') ? undefined : stat.id,
                    label: stat.label,
                    value: stat.value,
                    label_uz: stat.label_uz || '',
                    label_en: stat.label_en || '',
                    icon: stat.icon || 'Globe',
                    sort_order: stat.sort_order
                };
                if (prepared.id === undefined) delete prepared.id;
                return prepared;
            });

            if (preparedStats.length > 0) {
                const { error: statsError } = await supabase.from('about_stats').upsert(preparedStats);
                if (statsError) throw statsError;
            }

            // 5. Save Pages (Batch with onConflict)
            if (pages.length > 0) {
                const { error: pagesError } = await supabase.from('site_pages').upsert(pages, { onConflict: 'key' });
                if (pagesError) throw pagesError;
            }

            showNotification('success', 'Все изменения максимально успешно сохранены!');
            await fetchData();
        } catch (error) {
            console.error('Save error details:', error);
            showNotification('error', `Ошибка сохранения: ${error.message || 'Неизвестная ошибка'}`);
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

    if (loading) return (
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <Loader className="spin" size={40} color="#2563eb" />
            <p style={{ color: '#64748b', fontWeight: 500 }}>Загрузка редактора...</p>
        </div>
    );

    const handlePageToggle = (id) => {
        setPages(prev => prev.map(p => String(p.id) === String(id) ? { ...p, is_active: !p.is_active } : p));
    };

    const SectionHeader = ({ title, sectionKey, icon }) => (
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
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '32px 40px',
                borderRadius: '16px',
                marginBottom: '32px',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Редактор Главной Страницы</h2>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px' }}>Управление всеми секциями и контентом главной страницы</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => setActiveLang(lang.code)}
                                style={{
                                    background: activeLang === lang.code ? 'white' : 'transparent',
                                    color: activeLang === lang.code ? '#667eea' : 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <span>{lang.flag}</span>
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

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

            {/* Page Management Section */}
            <div style={{ marginBottom: '24px' }}>
                <SectionHeader title="🌐 Управление страницами (Меню)" sectionKey="pages" />
                {expandedSections.pages && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                            Здесь вы можете включить или отключить отображение страниц в главном меню сайта.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                            {pages.map((page) => (
                                <div key={page.id} style={{
                                    background: page.is_active ? '#f0fdf4' : '#f8fafc',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: `1px solid ${page.is_active ? '#bbf7d0' : '#e2e8f0'}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    transition: 'all 0.2s'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '700', color: page.is_active ? '#166534' : '#475569' }}>{page.default_title}</span>
                                        {page.key === 'home' ? (
                                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Всегда активна</div>
                                        ) : (
                                            <button
                                                onClick={() => handlePageToggle(page.id)}
                                                style={{
                                                    background: page.is_active ? '#10b981' : '#cbd5e1',
                                                    border: 'none',
                                                    borderRadius: '20px',
                                                    width: '40px',
                                                    height: '22px',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    background: 'white',
                                                    borderRadius: '50%',
                                                    position: 'absolute',
                                                    top: '3px',
                                                    left: page.is_active ? '21px' : '3px',
                                                    transition: 'all 0.2s'
                                                }} />
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                                        {page.is_active ? <Eye size={14} color="#10b981" /> : <EyeOff size={14} />}
                                        {page.is_active ? 'Видна в меню' : 'Скрыта'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Hero Section */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="🎬 Hero Секция" sectionKey="hero" />
                {expandedSections.hero && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Заголовок</label>
                                <textarea
                                    value={hero[getFieldName('title')] || ''}
                                    onChange={(e) => handleHeroChange('title', e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit', minHeight: '80px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Описание</label>
                                <textarea
                                    value={hero[getFieldName('description')] || ''}
                                    onChange={(e) => handleHeroChange('description', e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit', minHeight: '80px' }}
                                />
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h4 style={{ marginBottom: '16px', color: '#334155', fontSize: '15px', fontWeight: '700' }}>Фон Hero Секции</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'end' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '13px' }}>Тип фона</label>
                                    <select
                                        value={hero.background_type || 'video'}
                                        onChange={(e) => setHero(prev => ({ ...prev, background_type: e.target.value }))}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                    >
                                        <option value="video">Видео</option>
                                        <option value="image">Изображение</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '13px' }}>
                                        Загрузить {hero.background_type === 'video' ? 'видео (MP4)' : 'изображение'}
                                    </label>
                                    <input
                                        type="file"
                                        accept={hero.background_type === 'video' ? 'video/mp4' : 'image/*'}
                                        onChange={(e) => handleFileUpload(e.target.files[0], 'hero-assets', 'background_url')}
                                        style={{ display: 'block', width: '100%', fontSize: '13px' }}
                                    />
                                    <p style={{ marginTop: '5px', fontSize: '11px', color: '#64748b' }}>Макс. 30МБ</p>
                                </div>
                            </div>
                            {hero.background_url && (
                                <div style={{ marginTop: '16px', padding: '10px', background: 'white', borderRadius: '6px', border: '1px dashed #cbd5e1', fontSize: '13px', color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    Текущий файл: <a href={hero.background_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{hero.background_url.split('/').pop()}</a>
                                </div>
                            )}
                        </div>

                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h4 style={{ marginBottom: '16px', color: '#334155', fontSize: '15px', fontWeight: '700' }}>Карточка документа</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                                <input
                                    placeholder="Метка (Документ)"
                                    value={hero[getFieldName('card_label')] || ''}
                                    onChange={(e) => handleHeroChange('card_label', e.target.value)}
                                    style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                />
                                <input
                                    placeholder="Заголовок карточки"
                                    value={hero[getFieldName('card_title')] || ''}
                                    onChange={(e) => handleHeroChange('card_title', e.target.value)}
                                    style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                />
                                <textarea
                                    placeholder="Текст карточки"
                                    value={hero[getFieldName('card_text')] || ''}
                                    onChange={(e) => handleHeroChange('card_text', e.target.value)}
                                    style={{ gridColumn: '1 / -1', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '60px' }}
                                />
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '13px' }}>Загрузить/заменить документ (PDF)</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileUpload(e.target.files[0], 'documents', 'document_url')}
                                        style={{ display: 'block', width: '100%', fontSize: '13px' }}
                                    />
                                    {hero.document_url && (
                                        <div style={{ marginTop: '8px', fontSize: '12px' }}>
                                            Файл: <a href={hero.document_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{hero.document_url.split('/').pop()}</a>
                                        </div>
                                    )}
                                </div>
                                <input
                                    placeholder="Или вставьте ссылку на сторонний ресурс"
                                    value={hero[getFieldName('card_link')] || ''}
                                    onChange={(e) => handleHeroChange('card_link', e.target.value)}
                                    style={{ gridColumn: '1 / -1', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                />
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                            <h4 style={{ marginBottom: '16px', color: '#334155', fontSize: '15px', fontWeight: '700' }}>Нижняя панель</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                                <input
                                    placeholder="Заголовок (Исследование 2025:)"
                                    value={hero[getFieldName('footer_title')] || ''}
                                    onChange={(e) => handleHeroChange('footer_title', e.target.value)}
                                    style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                />
                                <input
                                    placeholder="Описание"
                                    value={hero[getFieldName('footer_desc')] || ''}
                                    onChange={(e) => handleHeroChange('footer_desc', e.target.value)}
                                    style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                />
                                <input
                                    placeholder="Ссылка для перехода"
                                    value={hero[getFieldName('footer_link')] || ''}
                                    onChange={(e) => handleHeroChange('footer_link', e.target.value)}
                                    style={{ gridColumn: '1 / -1', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* About Section */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="📖 О нас" sectionKey="about" />
                {expandedSections.about && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Заголовок</label>
                                <input
                                    value={sections.about_preview[getFieldName('title')] || ''}
                                    onChange={(e) => handleSectionChange('about_preview', 'title', e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Описание</label>
                                <textarea
                                    value={sections.about_preview[getFieldName('description')] || ''}
                                    onChange={(e) => handleSectionChange('about_preview', 'description', e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '100px' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', borderTop: '1px dashed #e2e8f0', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h4 style={{ color: '#334155', fontWeight: '700' }}>Мини-карточки со статистикой (на главной)</h4>
                                <button
                                    onClick={() => addNewItem('about_stats')}
                                    style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Plus size={14} /> Добавить показатель
                                </button>
                            </div>
                            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Первые два элемента будут отображены в визуальном блоке справа от текста "О нас".</p>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {items.about_stats.map((stat, i) => (
                                    <div key={stat.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <IconPicker value={stat.icon || 'Cpu'} onChange={(val) => handleItemChange('about_stats', stat.id, 'icon', val)} />
                                            <input
                                                placeholder="Значение (напр. 94%)"
                                                value={stat.value || ''}
                                                onChange={(e) => handleItemChange('about_stats', stat.id, 'value', e.target.value)}
                                                style={{ width: '120px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                            />
                                            <input
                                                placeholder="Текст (напр. Эффективность)"
                                                value={stat[getFieldName('label')] || ''}
                                                onChange={(e) => handleItemChange('about_stats', stat.id, 'label', e.target.value)}
                                                style={{ flex: 2, padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                            />
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button onClick={() => moveItem('about_stats', i, -1)} disabled={i === 0} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px' }}><MoveUp size={14} /></button>
                                                <button onClick={() => moveItem('about_stats', i, 1)} disabled={i === items.about_stats.length - 1} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px' }}><MoveDown size={14} /></button>
                                                <button onClick={() => removeItem('about_stats', stat.id)} style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px' }}><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Projects Section */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="🚀 Ключевые проекты" sectionKey="projects" />
                {expandedSections.projects && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <input
                                placeholder="Заголовок секции"
                                value={sections.projects_heading[getFieldName('title')] || ''}
                                onChange={(e) => handleSectionChange('projects_heading', 'title', e.target.value)}
                                style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginRight: '16px' }}
                            />
                            <button
                                onClick={() => addNewItem('projects')}
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
                                <Plus size={18} /> Добавить проект
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {items.projects.map((item, i) => (
                                <div key={item.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontWeight: '700', color: '#334155' }}>Проект #{i + 1}</span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => moveItem('projects', i, -1)} disabled={i === 0} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><MoveUp size={14} /></button>
                                            <button onClick={() => moveItem('projects', i, 1)} disabled={i === items.projects.length - 1} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><MoveDown size={14} /></button>
                                            <button onClick={() => removeItem('projects', item.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 2fr', gap: '12px' }}>
                                        <IconPicker value={item.icon || 'Globe'} onChange={(val) => handleItemChange('projects', item.id, 'icon', val)} />
                                        <input
                                            placeholder="Название"
                                            value={item[getFieldName('title')] || ''}
                                            onChange={(e) => handleItemChange('projects', item.id, 'title', e.target.value)}
                                            style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                        />
                                        <input
                                            placeholder="Описание"
                                            value={item[getFieldName('description')] || ''}
                                            onChange={(e) => handleItemChange('projects', item.id, 'description', e.target.value)}
                                            style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Working Groups Section */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="� Комитеты (Working Groups)" sectionKey="committees" />
                {expandedSections.committees && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Заголовок секции</label>
                                <input
                                    value={sections.wg_heading[getFieldName('title')] || ''}
                                    onChange={(e) => handleSectionChange('wg_heading', 'title', e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Описание секции</label>
                                <textarea
                                    value={sections.wg_heading[getFieldName('description')] || ''}
                                    onChange={(e) => handleSectionChange('wg_heading', 'description', e.target.value)}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '80px' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h4 style={{ color: '#334155', fontWeight: '700' }}>Список комитетов</h4>
                            <button onClick={() => addNewItem('working_groups')} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                                <Plus size={16} /> Добавить комитет
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {items.working_groups.map((item, i) => (
                                <div key={item.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontWeight: '700', fontSize: '14px' }}>Комитет #{i + 1}</span>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button onClick={() => moveItem('working_groups', i, -1)} disabled={i === 0} style={{ padding: '4px' }}><MoveUp size={14} /></button>
                                            <button onClick={() => moveItem('working_groups', i, 1)} disabled={i === items.working_groups.length - 1} style={{ padding: '4px' }}><MoveDown size={14} /></button>
                                            <button onClick={() => removeItem('working_groups', item.id)} style={{ padding: '4px', color: '#dc2626' }}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '12px' }}>
                                        <IconPicker value={item.icon || 'Users'} onChange={(val) => handleItemChange('working_groups', item.id, 'icon', val)} />
                                        <input
                                            placeholder="Название"
                                            value={item[getFieldName('title')] || ''}
                                            onChange={(e) => handleItemChange('working_groups', item.id, 'title', e.target.value)}
                                            style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                        />
                                        <input
                                            placeholder="Краткое описание"
                                            value={item[getFieldName('description')] || ''}
                                            onChange={(e) => handleItemChange('working_groups', item.id, 'description', e.target.value)}
                                            style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Features (Role of AI) Section */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="✨ Преимущества и Опыт" sectionKey="features" />
                {expandedSections.features && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                            <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px' }}>
                                <h4 style={{ marginBottom: '16px', color: '#0369a1' }}>Роль технологий ИИ</h4>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Заголовок</label>
                                        <textarea
                                            value={sections.feature_main[getFieldName('title')] || ''}
                                            onChange={(e) => handleSectionChange('feature_main', 'title', e.target.value)}
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Описание</label>
                                        <textarea
                                            value={sections.feature_main[getFieldName('description')] || ''}
                                            onChange={(e) => handleSectionChange('feature_main', 'description', e.target.value)}
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '80px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ background: '#f5f3ff', padding: '20px', borderRadius: '12px' }}>
                                <h4 style={{ marginBottom: '16px', color: '#6d28d9' }}>Опыт применения</h4>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Заголовок (ОПЫТ ПРИМЕНЕНИЯ)</label>
                                        <input
                                            value={sections.feature_exp[getFieldName('title')] || ''}
                                            onChange={(e) => handleSectionChange('feature_exp', 'title', e.target.value)}
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Описание</label>
                                        <textarea
                                            value={sections.feature_exp[getFieldName('description')] || ''}
                                            onChange={(e) => handleSectionChange('feature_exp', 'description', e.target.value)}
                                            style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '80px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h4 style={{ color: '#334155', fontWeight: '700' }}>Ключевые преимущества (Список)</h4>
                                <button onClick={() => addNewItem('feature_advantages')} className="btn-secondary">
                                    <Plus size={16} /> Добавить преимущество
                                </button>
                            </div>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {items.feature_advantages.map((item, i) => (
                                    <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                                        <span style={{ fontSize: '18px', color: '#cbd5e1' }}>—</span>
                                        <input
                                            value={item[getFieldName('title')] || ''}
                                            onChange={(e) => handleItemChange('feature_advantages', item.id, 'title', e.target.value)}
                                            style={{ flex: 1, padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                        />
                                        <button onClick={() => moveItem('feature_advantages', i, -1)} disabled={i === 0}><MoveUp size={14} /></button>
                                        <button onClick={() => moveItem('feature_advantages', i, 1)} disabled={i === items.feature_advantages.length - 1}><MoveDown size={14} /></button>
                                        <button onClick={() => removeItem('feature_advantages', item.id)} style={{ color: '#dc2626' }}><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Partners (Logo) Section */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="🤝 Партнеры (Логотипы)" sectionKey="partners" />
                {expandedSections.partners && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>Управляйте списком компаний-участников. В текущей версии отображаются текстовые названия.</p>
                            <button onClick={() => addNewItem('partners')} className="btn-secondary">
                                <Plus size={16} /> Добавить партнера
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {items.partners.map((item, i) => (
                                <div key={item.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                            {item.image_url ? (
                                                <img src={item.image_url} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <ImageIcon size={24} color="#94a3b8" />
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                value={item.title || ''}
                                                onChange={(e) => handleItemChange('partners', item.id, 'title', e.target.value)}
                                                placeholder="Название компании"
                                                style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}
                                            />
                                            <label className="upload-link" style={{ fontSize: '12px', color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Upload size={12} /> {item.image_url ? 'Заменить лого' : 'Загрузить лого'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleItemFileUpload(e.target.files[0], 'partners', item.id, 'image_url')}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        </div>
                                        <button onClick={() => removeItem('partners', item.id)} style={{ color: '#dc2626', padding: '8px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mission Section */}
            <div style={{ marginBottom: '16px' }}>
                <SectionHeader title="🎯 Миссия и Структура" sectionKey="mission" />
                {expandedSections.mission && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={{ background: '#fff7ed', padding: '20px', borderRadius: '12px' }}>
                                <h4 style={{ marginBottom: '16px', color: '#c2410c' }}>Миссия</h4>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    <input
                                        value={sections.mission_left[getFieldName('title')] || ''}
                                        onChange={(e) => handleSectionChange('mission_left', 'title', e.target.value)}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: '700' }}
                                    />
                                    <textarea
                                        value={sections.mission_left[getFieldName('description')] || ''}
                                        onChange={(e) => handleSectionChange('mission_left', 'description', e.target.value)}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '120px' }}
                                    />
                                </div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                                <h4 style={{ marginBottom: '16px', color: '#334155' }}>Открытая структура</h4>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    <input
                                        value={sections.mission_right[getFieldName('title')] || ''}
                                        onChange={(e) => handleSectionChange('mission_right', 'title', e.target.value)}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: '700' }}
                                    />
                                    <textarea
                                        value={sections.mission_right[getFieldName('description')] || ''}
                                        onChange={(e) => handleSectionChange('mission_right', 'description', e.target.value)}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '120px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px dashed #e2e8f0' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Текст кнопки CTA (Стать участником)</label>
                            <input
                                value={sections.home_cta?.[getFieldName('title')] || ''}
                                onChange={(e) => handleSectionChange('home_cta', 'title', e.target.value)}
                                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            />
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

export default AdminHome;
