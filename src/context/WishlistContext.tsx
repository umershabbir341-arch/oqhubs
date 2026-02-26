'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

import { Product } from '@/types';

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (product: Product) => void;
    isInitialized: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'rawblox_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadWishlist = () => {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        setWishlist(parsed);
                    }
                }
            } catch (e) {
                console.error('Failed to load wishlist:', e);
            } finally {
                setIsInitialized(true);
            }
        };

        loadWishlist();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                try {
                    setWishlist(JSON.parse(e.newValue));
                } catch (e) {
                    console.error('Failed to sync wishlist:', e);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            const exists = prev.some((item) => item.id === product.id);
            if (exists) return prev;
            const updated = [...prev, product];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist((prev) => {
            const updated = prev.filter((item) => item.id !== productId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const isInWishlist = (productId: any) => {
        return wishlist.some((item) => String(item.id) === String(productId));
    };

    const toggleWishlist = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, isInitialized }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
