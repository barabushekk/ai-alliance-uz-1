import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, X, ChevronDown, HelpCircle } from 'lucide-react';

const popularIcons = [
    'Users', 'Target', 'TrendingUp', 'Briefcase', 'Globe', 'FileText', 'Book', 'Download',
    'Eye', 'Play', 'Newspaper', 'Calendar', 'Scale', 'GraduationCap', 'Microscope', 'Database',
    'Cpu', 'Brain', 'Lightbulb', 'Search', 'Mail', 'Phone', 'MapPin', 'Check', 'Info',
    'AlertTriangle', 'Settings', 'Bell', 'Clock', 'User', 'Lock', 'Shield', 'BarChart',
    'PieChart', 'Activity', 'Award', 'Building', 'Zap', 'Star', 'Heart'
];

const IconPicker = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);

    // Filter available icons - exclude internal Lucide functions
    const allIconNames = useMemo(() => {
        return Object.keys(LucideIcons).filter(name =>
            typeof LucideIcons[name] === 'function' &&
            /^[A-Z]/.test(name) &&
            name !== 'createLucideIcon' &&
            name !== 'Lucide'
        );
    }, []);

    const filteredIcons = useMemo(() => {
        const s = search.toLowerCase();
        return allIconNames.filter(name => name.toLowerCase().includes(s));
    }, [search, allIconNames]);

    // Handle click away
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const SelectedIcon = LucideIcons[value] || HelpCircle;

    return (
        <div className="icon-picker-ref-container" ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: 'white',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    color: '#2563eb'
                }}>
                    <SelectedIcon size={20} />
                </div>
                <span style={{ flex: 1, fontSize: '14px', color: value ? '#1e293b' : '#94a3b8', fontWeight: value ? '600' : '400' }}>
                    {value || 'Выберите иконку'}
                </span>
                <ChevronDown size={18} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 5px)',
                    left: 0,
                    zIndex: 99999,
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    width: '320px',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                autoFocus
                                placeholder="Поиск (на англ.)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 38px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    background: '#f8fafc'
                                }}
                            />
                            {search && <X size={14} onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer' }} />}
                        </div>
                    </div>

                    <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px' }}>
                        {!search && (
                            <>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', padding: '4px 8px', marginBottom: '4px' }}>Популярные</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '12px' }}>
                                    {popularIcons.map(name => {
                                        const Icon = LucideIcons[name] || HelpCircle;
                                        return (
                                            <div key={`pop-${name}`} onClick={(e) => { e.stopPropagation(); onChange(name); setIsOpen(false); }} title={name}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1/1', borderRadius: '8px', cursor: 'pointer', color: value === name ? '#2563eb' : '#64748b', background: value === name ? '#eff6ff' : 'transparent', transition: 'all 0.1s ease' }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#2563eb'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = value === name ? '#eff6ff' : 'transparent'; e.currentTarget.style.color = value === name ? '#2563eb' : '#64748b'; }}
                                            >
                                                <Icon size={20} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', padding: '4px 8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginBottom: '4px' }}>Все иконки</div>
                            </>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                            {filteredIcons.slice(0, search ? 300 : 100).map(name => {
                                const Icon = LucideIcons[name];
                                return (
                                    <div key={name} onClick={(e) => { e.stopPropagation(); onChange(name); setIsOpen(false); }} title={name}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1/1', borderRadius: '8px', cursor: 'pointer', color: value === name ? '#2563eb' : '#64748b', background: value === name ? '#eff6ff' : 'transparent', transition: 'all 0.1s ease' }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#2563eb'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = value === name ? '#eff6ff' : 'transparent'; e.currentTarget.style.color = value === name ? '#2563eb' : '#64748b'; }}
                                    >
                                        <Icon size={20} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconPicker;
