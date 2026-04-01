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
    return (
        <AuthProvider>
            <CurrencyProvider>
                <UIProvider>
                    <CartProvider>
                        <WishlistProvider>
                            {children}
                        </WishlistProvider>
                    </CartProvider>
                </UIProvider>
            </CurrencyProvider>
        </AuthProvider>
    );
}
