"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Settings, Truck, Star, CheckCircle2 } from 'lucide-react';
import { MOCK_REVIEWS } from '@/constants/mockReviews';
import Price from '@/components/common/Price';

interface ProductInfoTabsProps {
    product: any;
}

const ProductInfoTabs: React.FC<ProductInfoTabsProps> = ({ product }) => {
    const [activeTab, setActiveTab] = useState('description');

    const tabs = [
        { id: 'description', label: 'Description', icon: FileText },
        { id: 'specifications', label: 'Specifications', icon: Settings },
        { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
        { id: 'reviews', label: 'Reviews', icon: Star },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'description':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-4 text-black dark:text-white">Product Description</h3>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base md:text-lg">
                                {product.description || "A clean, sturdy piece made for the everyday grind. Inspired by raw energy and built for movement, this statement piece blends style, attitude, and individuality."}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8">
                                <div className="p-5 md:p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                                    <h4 className="font-bold uppercase tracking-wider text-xs md:text-sm mb-3">Product Features</h4>
                                    <ul className="space-y-2 text-xs md:text-sm text-neutral-500">
                                        <li>• Premium cotton-poly blend</li>
                                        <li>• Durable reinforced stitching</li>
                                        <li>• Sustainable manufacturing</li>
                                        <li>• Signature RAWBLOX fit</li>
                                    </ul>
                                </div>
                                <div className="p-5 md:p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                                    <h4 className="font-bold uppercase tracking-wider text-xs md:text-sm mb-3">Care Instructions</h4>
                                    <ul className="space-y-2 text-xs md:text-sm text-neutral-500">
                                        <li>• Machine wash cold (max 30C)</li>
                                        <li>• Tumble dry low heat</li>
                                        <li>• Do not bleach</li>
                                        <li>• Iron on low heat if needed</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'specifications':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-6 text-black dark:text-white">Technical Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 md:gap-y-4">
                            {[
                                { label: 'Material', value: '80% Cotton, 20% Polyester' },
                                { label: 'Weight', value: '350 GSM (Heavyweight)' },
                                { label: 'Fit', value: 'Oversized / Relaxed' },
                                { label: 'Origin', value: 'Ethically Made' },
                                { label: 'Dye', value: 'Garment Dyed' },
                                { label: 'Stitching', value: 'Double-needle' },
                            ].map((spec, i) => (
                                <div key={i} className="flex justify-between py-3 border-b border-neutral-100 dark:border-neutral-800">
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">{spec.label}</span>
                                    <span className="text-xs md:text-sm font-semibold">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'shipping':
                return (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-4 text-black dark:text-white">Shipping & Returns</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                            <div className="flex flex-col gap-3 md:gap-4 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-black text-white dark:bg-white dark:text-black">
                                <Truck size={24} className="md:w-8 md:h-8" />
                                <div>
                                    <h4 className="font-bold uppercase tracking-tight text-base md:text-lg">Fast Delivery</h4>
                                    <p className="text-xs md:text-sm opacity-70 mt-2">Free standard shipping on all orders over <Price amount={150} />. Global tracking included.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 md:gap-4 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                <Settings size={24} className="text-neutral-400 md:w-8 md:h-8" />
                                <div>
                                    <h4 className="font-bold uppercase tracking-tight text-base md:text-lg">Easy Returns</h4>
                                    <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-2">30-day hassle-free return policy. We provide the label, you provide the moves.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 md:gap-4 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                <CheckCircle2 size={24} className="text-neutral-400 md:w-8 md:h-8" />
                                <div>
                                    <h4 className="font-bold uppercase tracking-tight text-base md:text-lg">Secure Pack</h4>
                                    <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-2">Sustainable packaging designed to protect your gear and the planet.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'reviews':
                return (
                    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 md:pb-8 border-b border-neutral-100 dark:border-neutral-800">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black dark:text-white">Customer Reviews</h3>
                                <div className="flex items-center gap-3 md:gap-4 mt-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" className="md:w-4 md:h-4" />)}
                                    </div>
                                    <span className="text-[10px] md:text-sm font-bold text-neutral-500 uppercase tracking-widest">Based on 128 Reviews</span>
                                </div>
                            </div>
                            <button className="w-full md:w-auto px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[10px] md:text-xs rounded-full hover:scale-105 transition-transform active:scale-95">
                                Write a Review
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:gap-8">
                            {MOCK_REVIEWS.map((review) => (
                                <div key={review.id} className="group p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-neutral-100/50 dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-800 transition-all hover:bg-white dark:hover:bg-neutral-800 shadow-sm hover:shadow-xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex text-black dark:text-white">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        fill={i < review.rating ? "currentColor" : "none"}
                                                        stroke="currentColor"
                                                        className="md:w-3.5 md:h-3.5"
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-bold uppercase tracking-tight text-sm md:text-base">{review.userName}</span>
                                                {review.isVerified && (
                                                    <span className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">
                                                        <CheckCircle2 size={8} className="md:w-2.5 md:h-2.5" /> Verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-widest">{review.date}</span>
                                    </div>
                                    <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                                        "{review.comment}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            {/* Unique Tab Navigation - Centered & Responsive */}
            <div className="flex items-center justify-start md:justify-center overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-1.5 p-1.5 bg-neutral-100 dark:bg-neutral-800/50 rounded-[2rem] border border-neutral-200/50 dark:border-neutral-800/50 mb-8 md:mb-12">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3.5 rounded-[1.75rem] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all relative z-10 whitespace-nowrap ${isActive
                                    ? 'text-white dark:text-black'
                                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                                    }`}
                            >
                                <Icon size={14} className="md:w-4 md:h-4" />
                                {tab.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabPill"
                                        className="absolute inset-0 bg-black dark:bg-white rounded-[1.756rem] -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content - Responsive Padding */}
            <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProductInfoTabs;
