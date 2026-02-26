"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, X } from 'lucide-react';
import { useUI } from '@/context/UIContext';

interface FilterDropdownProps {
    label: string;
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
    placeholder?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label,
    options,
    selected,
    onSelect,
    placeholder
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { setSheetOpen } = useUI();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (!isMobile) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile]);

    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
            setSheetOpen(`dropdown-${label}`, true);
        } else {
            document.body.style.overflow = 'unset';
            setSheetOpen(`dropdown-${label}`, false);
        }
        return () => {
            document.body.style.overflow = 'unset';
            setSheetOpen(`dropdown-${label}`, false);
        };
    }, [isOpen, isMobile, label, setSheetOpen]);

    const renderOptions = () => (
        <>
            <button
                onClick={() => {
                    onSelect('');
                    setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3.5 sm:py-2.5 rounded-xl text-sm transition-colors ${!selected
                    ? 'bg-neutral-100 font-bold text-black'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
                    }`}
            >
                All {label}s
            </button>
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => {
                        onSelect(option);
                        setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3.5 sm:py-2.5 rounded-xl text-sm transition-colors mt-0.5 ${selected === option
                        ? 'bg-neutral-100 font-bold text-black'
                        : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
                        }`}
                >
                    {option}
                </button>
            ))}
        </>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-[13px] font-bold transition-all duration-200 border ${selected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'
                    } active:scale-95`}
            >
                <span className="whitespace-nowrap uppercase tracking-wider">
                    {selected || label}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={14} className={selected ? 'text-white' : 'text-neutral-500'} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {isMobile ? (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsOpen(false)}
                                    className="fixed inset-0 bg-black/60 z-[998] backdrop-blur-[2px]"
                                />
                                {/* Bottom Sheet */}
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    drag="y"
                                    dragConstraints={{ top: 0, bottom: 0 }}
                                    dragElastic={{ top: 0, bottom: 0.5 }}
                                    onDragEnd={(event, info) => {
                                        if (info.offset.y > 80) {
                                            setIsOpen(false);
                                        }
                                    }}
                                    className="fixed bottom-0 left-0 right-0 z-[999] bg-white rounded-t-[32px] p-6 pb-12 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]"
                                >
                                    <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-8" />
                                    <h3 className="text-xl font-black uppercase mb-6 tracking-tight">Select {label}</h3>
                                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-1">
                                        {renderOptions()}
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 4, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute left-0 top-full z-[100] min-w-[200px] mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden py-2 px-1"
                            >
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {renderOptions()}
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterDropdown;
