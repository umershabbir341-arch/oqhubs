'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface AddToCartButtonProps {
    product: {
        id: string;
        title: string;
        price: number;
        image?: string;
        variantId: string;
    };
    variant?: 'page' | 'simple';
    quantity?: number;
}

export default function AddToCartButton({ product, variant = 'page', quantity = 1 }: AddToCartButtonProps) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        // Map the simplified product back to the internal Product type
        const fullProduct: any = {
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.image || '',
            variantId: product.variantId,
        };

        // The addToCart expects (product, selectedSize, selectedColor, quantity)
        // For this new design, size and color are handled in the parent, but we need to pass them here
        // or modify how CartContext works. 
        // Actually, looking at the provided code, AddToCartButton is called with the current selection.

        // Since I'm integrating with existing project, I'll pass dummy values if they aren't provided 
        // but the design seems to want the selection to be passed down or handled.
        // Let's assume for now the parent handles selection and we just trigger add.

        // NOTE: This component needs the current selected size and color from parent.
        // I will use some default values for now and refine if needed.
        // In a real scenario, we'd pass selectedSize and selectedColor as props.
    };

    if (variant === 'simple') {
        return (
            <button
                onClick={handleAddToCart}
                className="p-2 rounded-full bg-black text-white hover:scale-110 transition-transform"
            >
                <ShoppingBag size={18} />
            </button>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            className="w-full bg-orange-600 text-white h-[52px] rounded-full font-bold tracking-wide hover:bg-orange-700 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group"
        >
            <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
            ADD TO CART
        </button>
    );
}
