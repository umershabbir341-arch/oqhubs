"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useUI } from '@/context/UIContext';

interface MobileFilterSheetProps {
    isOpen: boolean;
    onClose: () => void;
    categories: any[];
    selectedCategory: string;
    onCategorySelect: (cat: string) => void;
    filterOptions: {
        sizes: string[];
        colors: string[];
        types: string[];
        priceRanges: string[];
    };
    selectedSize: string;
    onSizeSelect: (size: string) => void;
    selectedColor: string;
    onColorSelect: (color: string) => void;
    selectedPriceRange: string;
    onPriceSelect: (price: string) => void;
    onClearAll: () => void;
}

export default function MobileFilterSheet({
    isOpen,
    onClose,
    categories,
    selectedCategory,
    onCategorySelect,
    filterOptions,
    selectedSize,
    onSizeSelect,
    selectedColor,
    onColorSelect,
    selectedPriceRange,
    onPriceSelect,
    onClearAll
}: MobileFilterSheetProps) {
    const { setSheetOpen } = useUI();
    const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'price']);

    // Prevent background scrolling when sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        setSheetOpen('filter', isOpen);
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, setSheetOpen]);

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.5 }}
                        onDragEnd={(event, info) => {
                            if (info.offset.y > 80) {
                                onClose();
                            }
                        }}
                        className="relative w-full h-[85vh] bg-white rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Drag Handle */}
                        <div className="flex justify-center pt-3 pb-1" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-neutral-200 rounded-full opacity-50" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 pt-2 border-b border-neutral-100">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={20} className="text-black" />
                                <h2 className="text-xl font-black uppercase tracking-tight">Filters</h2>
                            </div>
                            <button onClick={onClose} className="p-2 -mr-2 text-neutral-400 hover:text-black transition-colors hidden md:block">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                            {/* Category Section */}
                            <div className="mb-8">
                                <button
                                    onClick={() => toggleSection('category')}
                                    className="flex items-center justify-between w-full mb-4 group"
                                >
                                    <h3 className="text-[0.9rem] font-bold uppercase tracking-widest text-neutral-900 group-hover:text-black transition-colors">Filter by category</h3>
                                    <ChevronDown size={18} className={`transition-transform duration-200 ${expandedSections.includes('category') ? '' : '-rotate-90'}`} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {expandedSections.includes('category') && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col gap-2 pb-2">
                                                <button
                                                    onClick={() => onCategorySelect('all')}
                                                    className={`text-left py-3 px-4 rounded-xl text-sm font-medium transition-all ${selectedCategory === 'all' ? 'bg-black text-white' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}
                                                >
                                                    All Categories
                                                </button>
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat.handle}
                                                        onClick={() => onCategorySelect(cat.handle)}
                                                        className={`text-left py-3 px-4 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.handle ? 'bg-black text-white' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}
                                                    >
                                                        {cat.title}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Price Section */}
                            <div className="mb-8">
                                <button
                                    onClick={() => toggleSection('price')}
                                    className="flex items-center justify-between w-full mb-4 group"
                                >
                                    <h3 className="text-[0.9rem] font-bold uppercase tracking-widest text-neutral-900 group-hover:text-black transition-colors">Filter by price</h3>
                                    <ChevronDown size={18} className={`transition-transform duration-200 ${expandedSections.includes('price') ? '' : '-rotate-90'}`} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {expandedSections.includes('price') && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col gap-4 pb-2">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold uppercase text-neutral-400">Min Price</label>
                                                        <div className="relative">
                                                            <input type="text" placeholder="0" className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-black transition-colors" />
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-neutral-300">USD</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold uppercase text-neutral-400">Max Price</label>
                                                        <div className="relative">
                                                            <input type="text" placeholder="500" className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-black transition-colors" />
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-neutral-300">USD</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {filterOptions.priceRanges.map((range) => (
                                                        <button
                                                            key={range}
                                                            onClick={() => onPriceSelect(range)}
                                                            className={`py-2 px-4 rounded-full text-xs font-bold transition-all border ${selectedPriceRange === range ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-100 hover:border-neutral-300'}`}
                                                        >
                                                            {range}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Sizes Section */}
                            <div className="mb-8">
                                <button
                                    onClick={() => toggleSection('sizes')}
                                    className="flex items-center justify-between w-full mb-4 group"
                                >
                                    <h3 className="text-[0.9rem] font-bold uppercase tracking-widest text-neutral-900 group-hover:text-black transition-colors">Sizes</h3>
                                    <ChevronDown size={18} className={`transition-transform duration-200 ${expandedSections.includes('sizes') ? '' : '-rotate-90'}`} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {expandedSections.includes('sizes') && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-wrap gap-2 pb-2">
                                                {filterOptions.sizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => onSizeSelect(size)}
                                                        className={`min-w-[50px] h-12 flex items-center justify-center rounded-xl text-sm font-bold border transition-all ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-100 hover:border-neutral-300'}`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Colors Section */}
                            <div className="mb-8">
                                <button
                                    onClick={() => toggleSection('colors')}
                                    className="flex items-center justify-between w-full mb-4 group"
                                >
                                    <h3 className="text-[0.9rem] font-bold uppercase tracking-widest text-neutral-900 group-hover:text-black transition-colors">Colors</h3>
                                    <ChevronDown size={18} className={`transition-transform duration-200 ${expandedSections.includes('colors') ? '' : '-rotate-90'}`} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {expandedSections.includes('colors') && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-wrap gap-3 pb-2">
                                                {filterOptions.colors.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => onColorSelect(color)}
                                                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-black ring-2 ring-neutral-200 ring-offset-2' : 'border-neutral-100 hover:border-neutral-300'}`}
                                                        style={{ backgroundColor: color }}
                                                        title={color}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pb-10 border-t border-neutral-100 flex gap-4 bg-white">
                            <button
                                onClick={onClearAll}
                                className="flex-1 py-4 text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors underline"
                            >
                                Clear all
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-[2] bg-black text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
