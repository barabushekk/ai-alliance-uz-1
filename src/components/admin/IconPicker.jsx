import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { ChevronDown, Search } from 'lucide-react';
import '../../pages/admin/Admin.css'; // Ensure styles are loaded

const iconsList = [
    'Target', 'Eye', 'Shield', 'Award', 'Users', 'Zap', 'FileText', 'Globe',
    'Cpu', 'Database', 'Lightbulb', 'LineChart', 'Network', 'Rocket', 'Settings',
    'Star', 'TrendingUp', 'Activity', 'BookOpen', 'CheckCircle', 'Compass',
    'Flag', 'Heart', 'Layers', 'MessageSquare', 'Share2', 'Smartphone', 'Tool'
];

const IconPicker = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const renderIcon = (name, size = 20) => {
        const IconComponent = LucideIcons[name] || LucideIcons.Zap;
        return <IconComponent size={size} />;
    };

    const filteredIcons = iconsList.filter(icon =>
        icon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="icon-picker-root" ref={wrapperRef}>
            <div
                className={`icon-picker-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="trigger-icon-box">
                    {renderIcon(value)}
                </div>
                <span style={{
                    flexGrow: 1,
                    fontSize: '0.9rem',
                    color: '#1e293b',
                    fontWeight: 500
                }}>
                    {value}
                </span>
                <ChevronDown
                    size={16}
                    style={{
                        color: '#94a3b8',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                    }}
                />
            </div>

            {isOpen && (
                <div className="icon-picker-dropdown">
                    <div className="icon-search-box">
                        <Search
                            size={14}
                            style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8',
                                zIndex: 2
                            }}
                        />
                        <input
                            type="text"
                            className="icon-search-input"
                            placeholder="Найти иконку..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>

                    <div className="icon-grid">
                        {filteredIcons.map(iconName => (
                            <div
                                key={iconName}
                                className={`icon-option ${value === iconName ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(iconName);
                                    setIsOpen(false);
                                }}
                                title={iconName}
                            >
                                {renderIcon(iconName, 20)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconPicker;
