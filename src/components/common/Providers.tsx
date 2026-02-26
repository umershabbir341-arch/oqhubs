"use client";

import React, { useState, useEffect } from 'react';
import { UIProvider } from "@/context/UIContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import Loader from './Loader';
import { AnimatePresence, motion } from 'motion/react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800); // 800ms splash screen

        return () => clearTimeout(timer);
    }, []);

    return (
        <AuthProvider>
            <CurrencyProvider>
                <UIProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <AnimatePresence>
                                {isLoading ? (
                                    <Loader key="loader" />
                                ) : (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    >
                                        {children}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </WishlistProvider>
                    </CartProvider>
                </UIProvider>
            </CurrencyProvider>
        </AuthProvider>
    );
}
