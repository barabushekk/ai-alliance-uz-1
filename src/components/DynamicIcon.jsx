import React from 'react';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, size = 24, className = '', color = 'currentColor' }) => {
    // Basic fallback if name is missing or invalid
    if (!name) return null;

    const IconComponent = Icons[name];

    if (!IconComponent) {
        // Fallback to a generic icon if the specified one doesn't exist
        const Fallback = Icons.HelpCircle;
        return <Fallback size={size} className={className} color={color} />;
    }

    return <IconComponent size={size} className={className} color={color} />;
};

export default DynamicIcon;
