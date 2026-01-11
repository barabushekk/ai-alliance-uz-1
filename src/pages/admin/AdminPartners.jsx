import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader, AlertCircle, CheckCircle, Plus, Trash2, MoveUp, MoveDown, Globe, Handshake, Zap, Users, Building2, LayoutGrid } from 'lucide-react';
import IconPicker from '../../components/admin/IconPicker';
import '../../pages/admin/Admin.css';

const AdminPartners = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeLang, setActiveLang] = useState('ru');

    const [sections, setSections] = useState({
        hero: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        strategic_header: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        ecosystem_header: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        benefits_header: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' },
        cta: { title: '', description: '', title_uz: '', description_uz: '', title_en: '', description_en: '' }
    });

    const [strategic, setStrategic] = useState([]);
    const [categories, setCategories] = useState([]);
    const [benefits, setBenefits] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: sData } = await supabase.from('partners_sections').select('*');
            const { data: stratData } = await supabase.from('partners_strategic').select('*').order('sort_order', { ascending: true });
            const { data: catsData } = await supabase.from('partners_categories').select('*, partners_list(*)').order('sort_order', { ascending: true });
            const { data: benData } = await supabase.from('partners_benefits').select('*').order('sort_order', { ascending: true });

            if (sData) {
                const newSections = { ...sections };
                sData.forEach(item => { if (newSections[item.key]) newSections[item.key] = item; });
                setSections(newSections);
            }
            if (stratData) setStrategic(stratData);
            if (catsData) setCategories(catsData);
            if (benData) setBenefits(benData);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getFieldName = (baseField) => activeLang === 'ru' ? baseField : `${baseField}_${activeLang}`;

    const handleSectionChange = (key, field, value) => {
        const targetField = getFieldName(field);
        setSections(prev => ({ ...prev, [key]: { ...prev[key], [targetField]: value } }));
    };

    const handleItemChange = (list, setList, id, field, value) => {
        const loz = ['title', 'description', 'name', 'category', 'role', 'location'];
        const targetField = loz.includes(field) ? getFieldName(field) : field;
        setList(prev => prev.map(item => item.id === id ? { ...item, [targetField]: value } : item));
    };

    const addNewStrategic = () => {
        setStrategic([...strategic, { id: `temp-${Date.now()}`, name: 'Новый партнер', category: '', role: '', description: '', logo: 'LP', sort_order: strategic.length + 1 }]);
    };

    const addNewCategory = () => {
        setCategories([...categories, { id: `temp-${Date.now()}`, title: 'Новая категория', icon: 'Building2', sort_order: categories.length + 1, partners_list: [] }]);
    };

    const addNewPartnerToList = (catId) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id === catId) {
                const newList = [...(cat.partners_list || []), { id: `temp-p-${Date.now()}`, name: 'Партнер', location: '', category_id: catId, sort_order: (cat.partners_list?.length || 0) + 1 }];
                return { ...cat, partners_list: newList };
            }
            return cat;
        }));
    };

    const addNewBenefit = () => {
        setBenefits([...benefits, { id: `temp-${Date.now()}`, title: 'Преимущество', description: '', icon: 'Handshake', sort_order: benefits.length + 1 }]);
    };

    const removeItem = (list, setList, id) => setList(list.filter(i => i.id !== id));

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
                await supabase.from('partners_sections').upsert({ key, ...sections[key] });
            }

            const syncSingleList = async (table, list) => {
                const { data: db } = await supabase.from(table).select('id');
                const localIds = list.filter(i => typeof i.id !== 'string' || !i.id.startsWith('temp-')).map(i => i.id);
                const toDel = db?.filter(d => !localIds.includes(d.id)).map(d => d.id) || [];
                if (toDel.length > 0) await supabase.from(table).delete().in('id', toDel);
                for (const i of list) {
                    const prepared = { ...i };
                    if (typeof prepared.id === 'string' && prepared.id.startsWith('temp-')) delete prepared.id;
                    delete prepared.partners_list; // For categories
                    await supabase.from(table).upsert(prepared);
                }
            };

            await syncSingleList('partners_strategic', strategic);
            await syncSingleList('partners_benefits', benefits);

            // Sync categories and sub-partners
            const { data: dbCats } = await supabase.from('partners_categories').select('id');
            const catIds = categories.filter(c => typeof c.id !== 'string' || !c.id.startsWith('temp-')).map(c => c.id);
            const catsToDel = dbCats?.filter(d => !catIds.includes(d.id)).map(d => d.id) || [];
            if (catsToDel.length > 0) await supabase.from('partners_categories').delete().in('id', catsToDel);

            for (const cat of categories) {
                const catPrep = { ...cat };
                let realCatId = cat.id;
                if (typeof catPrep.id === 'string' && catPrep.id.startsWith('temp-')) {
                    delete catPrep.id;
                    delete catPrep.partners_list;
                    const { data: newCat } = await supabase.from('partners_categories').insert(catPrep).select().single();
                    realCatId = newCat.id;
                } else {
                    delete catPrep.partners_list;
                    await supabase.from('partners_categories').upsert(catPrep);
                }

                // Sub-partners for this category
                const { data: dbSub } = await supabase.from('partners_list').select('id').eq('category_id', realCatId);
                const subIds = (cat.partners_list || []).filter(p => typeof p.id !== 'string' || !p.id.startsWith('temp-')).map(p => p.id);
                const subToDel = dbSub?.filter(d => !subIds.includes(d.id)).map(d => d.id) || [];
                if (subToDel.length > 0) await supabase.from('partners_list').delete().in('id', subToDel);

                for (const p of (cat.partners_list || [])) {
                    const pPrep = { ...p, category_id: realCatId };
                    if (typeof pPrep.id === 'string' && pPrep.id.startsWith('temp-')) delete pPrep.id;
                    await supabase.from('partners_list').upsert(pPrep);
                }
            }

            showNotification('success', 'Партнеры успешно обновлены!');
            await fetchData();
        } catch (e) {
            console.error(e);
            showNotification('error', 'Ошибка при сохранении.');
        } finally {
            setSaving(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    if (loading) return <div className="admin-loading"><Loader className="spin" /> Загрузка партнеров...</div>;

    const languages = [{ c: 'ru', f: '🇷🇺' }, { c: 'uz', f: '🇺🇿' }, { c: 'en', f: '🇬🇧' }];

    return (
        <div className="admin-page" style={{ paddingBottom: '120px' }}>
            <div className="admin-page-header">
                <div>
                    <h2>Редактор "Партнеры"</h2>
                    <p>Управление стратегическими партнерами и экосистемой.</p>
                </div>
                <div className="lang-selector-pills">
                    {languages.map(l => (
                        <button key={l.c} onClick={() => setActiveLang(l.c)} className={activeLang === l.c ? 'active' : ''}>
                            {l.f} {l.c.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            {/* Hero & Sections Headers */}
            <div className="edit-section">
                <div className="section-label"><Globe size={20} /> Заголовки страниц</div>
                <div className="form-grid">
                    <div><span className="input-label">Hero Title ({activeLang})</span><input value={sections.hero[getFieldName('title')] || ''} onChange={e => handleSectionChange('hero', 'title', e.target.value)} /></div>
                    <div><span className="input-label">Hero Desc ({activeLang})</span><textarea value={sections.hero[getFieldName('description')] || ''} onChange={e => handleSectionChange('hero', 'description', e.target.value)} /></div>
                </div>
            </div>

            {/* Strategic Partners */}
            <div className="edit-section">
                <div className="section-header-row">
                    <div className="section-label"><Handshake size={20} /> Стратегические партнеры</div>
                    <button onClick={addNewStrategic} className="btn-secondary"><Plus /> Добавить</button>
                </div>
                <div className="form-grid">
                    {strategic.map((s, i) => (
                        <div key={s.id} className="list-item">
                            <div className="list-item-header">
                                <span>{s.name}</span>
                                <div className="item-controls">
                                    <button onClick={() => moveItem(strategic, setStrategic, i, -1)} disabled={i === 0}><MoveUp size={14} /></button>
                                    <button onClick={() => moveItem(strategic, setStrategic, i, 1)} disabled={i === strategic.length - 1}><MoveDown size={14} /></button>
                                    <button onClick={() => removeItem(strategic, setStrategic, s.id)} className="delete"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '80px 1fr 1fr 1fr' }}>
                                <div><span className="input-label">Logo</span><input style={{ textAlign: 'center' }} value={s.logo} onChange={e => handleItemChange(strategic, setStrategic, s.id, 'logo', e.target.value)} /></div>
                                <div><span className="input-label">Имя ({activeLang})</span><input value={s[getFieldName('name')] || ''} onChange={e => handleItemChange(strategic, setStrategic, s.id, 'name', e.target.value)} /></div>
                                <div><span className="input-label">Категория ({activeLang})</span><input value={s[getFieldName('category')] || ''} onChange={e => handleItemChange(strategic, setStrategic, s.id, 'category', e.target.value)} /></div>
                                <div><span className="input-label">Роль ({activeLang})</span><input value={s[getFieldName('role')] || ''} onChange={e => handleItemChange(strategic, setStrategic, s.id, 'role', e.target.value)} /></div>
                                <div style={{ gridColumn: 'span 4' }}><span className="input-label">Описание ({activeLang})</span><textarea value={s[getFieldName('description')] || ''} onChange={e => handleItemChange(strategic, setStrategic, s.id, 'description', e.target.value)} /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ecosystem Categories */}
            <div className="edit-section">
                <div className="section-header-row">
                    <div className="section-label"><LayoutGrid size={20} /> Экосистема (сетка ниже)</div>
                    <button onClick={addNewCategory} className="btn-secondary"><Plus /> Добавить направление</button>
                </div>
                <div className="form-grid">
                    {categories.map((cat, i) => (
                        <div key={cat.id} className="list-item group">
                            <div className="list-item-header">
                                <span style={{ fontWeight: 800 }}>Категория: {cat.title}</span>
                                <div className="item-controls">
                                    <button onClick={() => moveItem(categories, setCategories, i, -1)} disabled={i === 0}><MoveUp size={14} /></button>
                                    <button onClick={() => moveItem(categories, setCategories, i, 1)} disabled={i === categories.length - 1}><MoveDown size={14} /></button>
                                    <button onClick={() => removeItem(categories, setCategories, cat.id)} className="delete"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '200px 1fr' }}>
                                <div><span className="input-label">Icon</span><IconPicker value={cat.icon} onChange={v => handleItemChange(categories, setCategories, cat.id, 'icon', v)} /></div>
                                <div><span className="input-label">Заголовок ({activeLang})</span><input value={cat[getFieldName('title')] || ''} onChange={e => handleItemChange(categories, setCategories, cat.id, 'title', e.target.value)} /></div>
                            </div>
                            <div className="sub-list" style={{ marginTop: '20px', borderTop: '1px solid #edf2f7', paddingTop: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Список партнеров в этой категории:</span>
                                    <button onClick={() => addNewPartnerToList(cat.id)} className="btn-tiny"><Plus size={14} /> Добавить партнера</button>
                                </div>
                                <div className="p-list-grid">
                                    {(cat.partners_list || []).map((p, pIdx) => (
                                        <div key={p.id} className="p-item-row" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '10px' }}>
                                            <div style={{ flex: 2 }}><span className="input-label">Имя ({activeLang})</span><input value={p[getFieldName('name')] || ''} onChange={e => {
                                                const newList = cat.partners_list.map(pi => pi.id === p.id ? { ...pi, [getFieldName('name')]: e.target.value } : pi);
                                                handleItemChange(categories, setCategories, cat.id, 'partners_list', newList);
                                            }} /></div>
                                            <div style={{ flex: 1 }}><span className="input-label">Локация ({activeLang})</span><input value={p[getFieldName('location')] || ''} onChange={e => {
                                                const newList = cat.partners_list.map(pi => pi.id === p.id ? { ...pi, [getFieldName('location')]: e.target.value } : pi);
                                                handleItemChange(categories, setCategories, cat.id, 'partners_list', newList);
                                            }} /></div>
                                            <button onClick={() => {
                                                const newList = cat.partners_list.filter(pi => pi.id !== p.id);
                                                handleItemChange(categories, setCategories, cat.id, 'partners_list', newList);
                                            }} className="btn-delete-tiny"><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits */}
            <div className="edit-section">
                <div className="section-header-row">
                    <div className="section-label"><Zap size={20} /> Преимущества партнерства</div>
                    <button onClick={addNewBenefit} className="btn-secondary"><Plus /> Добавить</button>
                </div>
                <div className="form-grid">
                    {benefits.map((b, i) => (
                        <div key={b.id} className="list-item">
                            <div className="list-item-header">
                                <span>{b.title}</span>
                                <div className="item-controls">
                                    <button onClick={() => moveItem(benefits, setBenefits, i, -1)} disabled={i === 0}><MoveUp size={14} /></button>
                                    <button onClick={() => moveItem(benefits, setBenefits, i, 1)} disabled={i === benefits.length - 1}><MoveDown size={14} /></button>
                                    <button onClick={() => removeItem(benefits, setBenefits, b.id)} className="delete"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '200px 1fr' }}>
                                <div><span className="input-label">Icon</span><IconPicker value={b.icon} onChange={v => handleItemChange(benefits, setBenefits, b.id, 'icon', v)} /></div>
                                <div><span className="input-label">Заголовок ({activeLang})</span><input value={b[getFieldName('title')] || ''} onChange={e => handleItemChange(benefits, setBenefits, b.id, 'title', e.target.value)} /></div>
                                <div style={{ gridColumn: 'span 2' }}><span className="input-label">Описание ({activeLang})</span><textarea value={b[getFieldName('description')] || ''} onChange={e => handleItemChange(benefits, setBenefits, b.id, 'description', e.target.value)} /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="save-bars">
                <button onClick={saveAll} disabled={saving} className="btn-primary" style={{ minWidth: '300px' }}>
                    {saving ? <Loader className="spin" /> : <Save />}
                    {saving ? 'Сохранение...' : 'Сохранить все изменения'}
                </button>
            </div>
        </div>
    );
};

export default AdminPartners;
