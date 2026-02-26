"use client";

import React, { useState } from 'react';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { useCart } from '@/context/CartContext';
import SearchModal from './SearchModal';
import { useUI } from '@/context/UIContext';

const BottomNav = () => {
    const pathname = usePathname();
    const { toggleCart, totalItems } = useCart();
    const { isAnySheetOpen, openSearch } = useUI();

    const navItems = [
        { label: 'Home', icon: Home, path: '/' },
        { label: 'Search', icon: Search, isSearch: true },
        { label: 'Cart', icon: ShoppingBag, isCart: true },
        { label: 'Profile', icon: User, path: '/profile' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: 0 }}
                animate={{ y: isAnySheetOpen ? '100%' : 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden w-full"
            >
                <div className="bg-white/95 backdrop-blur-xl border-t border-black/5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-6 py-3 pb-2 flex justify-between items-center relative overflow-hidden rounded-t-[24px]">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;

                        if (item.isSearch) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={openSearch}
                                    className="relative flex flex-col items-center gap-1 group"
                                    aria-label="Open Search"
                                >
                                    <item.icon
                                        size={24}
                                        className="text-primary hover:text-primary transition-colors"
                                    />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary transition-colors">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        }

                        if (item.isCart) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={toggleCart}
                                    className="relative flex flex-col items-center gap-1 group"
                                    aria-label="Open Cart"
                                >
                                    <div className="relative">
                                        <item.icon
                                            size={24}
                                            className="text-primary hover:text-primary transition-colors"
                                        />
                                        {totalItems > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1.5 -right-1.5 bg-primary text-secondary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                                            >
                                                {totalItems}
                                            </motion.span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary transition-colors">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.label}
                                href={item.path || '/'}
                                className="relative flex flex-col items-center gap-1 group"
                            >
                                <div className="relative">
                                    <item.icon
                                        size={24}
                                        className={`${isActive ? 'text-primary' : 'text-primary/60'} group-hover:text-primary transition-colors`}
                                    />
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-primary' : 'text-primary/60'} group-hover:text-primary transition-colors`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </motion.nav>

        </>
    );
};

export default BottomNav;
