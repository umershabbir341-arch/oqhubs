'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomDropdownProps {
    value: string;
    options: string[];
    onChange: (value: string) => void;
    label: string;
}

export default function CustomDropdown({ value, options, onChange, label }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative w-full">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full px-5 py-4 
                    bg-white dark:bg-neutral-900 
                    border-2 rounded-xl
                    flex items-center justify-between
                    font-semibold text-left
                    transition-all duration-200
                    ${isOpen
                        ? 'border-orange-500 ring-4 ring-orange-100 dark:ring-orange-900/30'
                        : 'border-gray-200 dark:border-neutral-700 hover:border-orange-300 dark:hover:border-orange-800'
                    }
                `}
            >
                <span className="text-gray-900 dark:text-white truncate pr-4">
                    {value}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                >
                    <ChevronDown className="w-5 h-5 text-orange-500" />
                </motion.span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-900 border-2 border-gray-100 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
                        style={{ maxHeight: '280px' }}
                    >
                        <div className="overflow-y-auto max-h-[280px] py-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700">
                            {options.map((option, idx) => {
                                const isSelected = option === value;
                                return (
                                    <motion.button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className={`
                                            w-full px-5 py-3 
                                            flex items-center justify-between
                                            text-left font-medium
                                            transition-all duration-150
                                            ${isSelected
                                                ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                                            }
                                        `}
                                    >
                                        <span className="truncate pr-4">{option}</span>
                                        {isSelected && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex-shrink-0"
                                            >
                                                <Check className="w-5 h-5 text-orange-500" />
                                            </motion.span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
