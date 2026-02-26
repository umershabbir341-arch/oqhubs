"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
    cartItems: CartItem[];
    isCartOpen: boolean;
    addToCart: (product: Product, selectedSize: string, selectedColor: string, quantity: number) => void;
    removeFromCart: (productId: string, selectedSize: string, selectedColor: string) => void;
    updateQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number) => void;
    toggleCart: () => void;
    closeCart: () => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Persist cart to localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    const addToCart = (product: Product, selectedSize: string, selectedColor: string, quantity: number) => {
        setCartItems(prev => {
            const existingItem = prev.find(item =>
                item.id === product.id &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
            );

            if (existingItem) {
                return prev.map(item =>
                    (item.id === product.id &&
                        item.selectedSize === selectedSize &&
                        item.selectedColor === selectedColor)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // Find the specific variant ID and price if variants are provided
            let specificVariantId = product.variantId || '';
            let price = product.price;
            let originalPrice = product.originalPrice;

            if (product.variants) {
                const variant = product.variants.find((v: any) => {
                    const hasSize = v.selectedOptions.some((opt: any) => opt.name.toLowerCase() === 'size' && opt.value === selectedSize);
                    const hasColor = v.selectedOptions.some((opt: any) => opt.name.toLowerCase() === 'color' && opt.value === selectedColor);
                    return hasSize && hasColor;
                });
                if (variant) {
                    specificVariantId = variant.id;
                    price = parseFloat(variant.price.amount);
                    if (variant.compareAtPrice) {
                        originalPrice = parseFloat(variant.compareAtPrice.amount);
                    }
                }
            }

            return [...prev, { ...product, price, originalPrice, quantity, selectedSize, selectedColor, variantId: specificVariantId }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, selectedSize: string, selectedColor: string) => {
        setCartItems(prev => prev.filter(item =>
            !(item.id === productId &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor)
        ));
    };

    const updateQuantity = (productId: string, selectedSize: string, selectedColor: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId, selectedSize, selectedColor);
            return;
        }
        setCartItems(prev => prev.map(item =>
            (item.id === productId &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor)
                ? { ...item, quantity }
                : item
        ));
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);
    const closeCart = () => setIsCartOpen(false);
    const clearCart = () => setCartItems([]);

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleCart,
            closeCart,
            clearCart,
            totalAmount,
            totalItems
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
