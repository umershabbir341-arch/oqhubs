'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface Category {
    id: string;
    title: string;
    handle: string;
}

interface CategoriesDropdownProps {
    categories: Category[];
    label: string;
    colorClassName?: string;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ categories, label, colorClassName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    if (categories.length === 0) return null;

    return (
        <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                initial="initial"
                whileHover="hover"
                className="relative group overflow-hidden py-1"
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`text-sm font-semibold ${colorClassName || 'text-primary'} tracking-[0.05em] flex items-center gap-1 transition-colors uppercase font-outfit`}
                >
                    {label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <motion.span
                    className="absolute bottom-0 left-0 h-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    variants={{
                        initial: { width: 0 },
                        hover: { width: '100%' }
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ originX: 0 }}
                />
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-3 w-64 bg-white border border-black/5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden z-[1100]"
                    >
                        <div className="p-2">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/collections/${cat.handle}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-black hover:bg-zinc-50 transition-colors group uppercase"
                                >
                                    {cat.title}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoriesDropdown;
