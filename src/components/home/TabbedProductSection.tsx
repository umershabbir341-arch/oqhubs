'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '@/components/common/ProductCard';

interface TabbedProductSectionProps {
    firstCategoryProducts: any[];
    secondCategoryProducts: any[];
    firstCategoryLabel: string;
    secondCategoryLabel: string;
    title?: string;
}

export default function TabbedProductSection({
    firstCategoryProducts,
    secondCategoryProducts,
    firstCategoryLabel,
    secondCategoryLabel,
    title = "Just Launched"
}: TabbedProductSectionProps) {
    const [activeTab, setActiveTab] = useState<'first' | 'second'>('first');

    const tabs = [
        { id: 'first', label: firstCategoryLabel },
        { id: 'second', label: secondCategoryLabel }
    ];

    const currentProducts = activeTab === 'first' ? firstCategoryProducts : secondCategoryProducts;

    return (
        <section className="max-w-[95vw] mx-auto py-8">
            <div className="flex flex-row justify-between items-center mb-6 md:mb-10 gap-3">
                <div className="flex-shrink-0">
                    <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    <div className="hidden sm:block h-1.5 w-16 bg-black dark:bg-white rounded-full mt-2"></div>
                </div>

                <div className="flex bg-gray-100 dark:bg-neutral-800 p-1.5 rounded-full shadow-inner">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'first' | 'second')}
                            className={`relative px-4 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                                ? 'text-white dark:text-black'
                                : 'text-gray-500 hover:text-black dark:hover:text-white'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-black dark:bg-white rounded-full shadow-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label.toUpperCase()}</span>
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6"
                >
                    {currentProducts && currentProducts.length > 0 ? (
                        currentProducts.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-500 text-lg">No products found in this collection.</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
