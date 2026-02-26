'use client';

import React, { useMemo } from 'react';

interface UserAvatarProps {
    firstName: string;
    lastName?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
}

const colors = [
    'bg-teal-600',
    'bg-rose-600',
    'bg-indigo-600',
    'bg-amber-600',
    'bg-emerald-600',
    'bg-blue-600',
    'bg-violet-600',
    'bg-fuchsia-600',
];

const UserAvatar: React.FC<UserAvatarProps> = ({ firstName, lastName, size = 'md', className = '', onClick }) => {
    const initials = useMemo(() => {
        const first = firstName?.charAt(0) || '';
        const last = lastName?.charAt(0) || '';
        return (first + last).toUpperCase() || '?';
    }, [firstName, lastName]);

    const bgColor = useMemo(() => {
        const charCodeSum = (firstName + (lastName || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[charCodeSum % colors.length];
    }, [firstName, lastName]);

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
    };

    return (
        <div
            onClick={onClick}
            className={`${sizeClasses[size]} ${bgColor} ${className} rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity border-2 border-white/10`}
        >
            {initials.length > 1 ? initials.charAt(0) : initials}
        </div>
    );
};

export default UserAvatar;
