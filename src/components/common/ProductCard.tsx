"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Price from './Price';

interface ProductCardProps {
    product: Product;
}

// Helper function to extract color from variant titles or name
function extractColor(title: string): string {
    const colorMap: { [key: string]: string } = {
        'red': '#EF4444',
        'blue': '#3B82F6',
        'green': '#10B981',
        'yellow': '#F59E0B',
        'purple': '#A855F7',
        'pink': '#EC4899',
        'black': '#000000',
        'white': '#FFFFFF',
        'gray': '#6B7280',
        'grey': '#6B7280',
        'orange': '#F97316',
        'brown': '#92400E',
        'beige': '#D4C5B9',
        'navy': '#1E3A8A',
        'maroon': '#7F1D1D',
        'silver': '#C0C0C0',
        'gold': '#FFD700',
    };

    const lowerTitle = title.toLowerCase();
    for (const [name, hex] of Object.entries(colorMap)) {
        if (lowerTitle.includes(name)) return hex;
    }
    return '#E5E7EB';
}

// Generate consistent random rating based on product ID
function getProductRating(productId: string): number {
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
        hash = ((hash << 5) - hash) + productId.charCodeAt(i);
        hash = hash & hash;
    }
    const rating = 4.0 + (Math.abs(hash) % 100) / 100;
    return Math.round(rating * 100) / 100;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart, toggleCart } = useCart();
    const { toggleWishlist, isInWishlist, isInitialized } = useWishlist();
    const [isMounted, setIsMounted] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    // Dynamic selection state
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    useEffect(() => {
        setIsMounted(true);
        // Initialize with default or first options
        if (product.options) {
            const initial: Record<string, string> = {};
            product.options.forEach(opt => {
                initial[opt.name] = opt.values[0] || '';
            });
            setSelectedOptions(initial);
        }
    }, [product.options]);

    // Map variation data to UI-friendly swatches
    const colorOptions = useMemo(() => {
        return product.options?.find(opt => opt.name.toLowerCase().includes('color'));
    }, [product.options]);

    // Derived states
    const isWishlisted = (isMounted && isInitialized) ? isInWishlist(product.id) : false;
    const rating = useMemo(() => product.rating || getProductRating(product.id), [product.id, product.rating]);
    const reviewCount = product.reviewCount || 1;

    // Find matching variant if variations are loaded
    const selectedVariant = useMemo(() => {
        if (!product.variants || !product.options) return null;
        return product.variants.find((v: any) => {
            return v.selectedOptions.every((vOpt: any) => {
                return selectedOptions[vOpt.name] === vOpt.value;
            });
        });
    }, [product.variants, product.options, selectedOptions]);

    // Determine which image to show
    const displayImage = selectedVariant?.image?.url || product.image;
    const hoverImage = product.gallery && product.gallery.length > 1 ? product.gallery[1] : null;

    const discountPercentage = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleOptionSelect = (e: React.MouseEvent, optionName: string, value: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
        setIsAdded(false);
    };

    const handleAddToBag = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdded) {
            toggleCart();
            return;
        }

        setIsAdding(true);
        try {
            const selectedSize = selectedOptions['Size'] || selectedOptions['size'] || '';
            const selectedColor = selectedOptions['Color'] || selectedOptions['color'] || '';

            await addToCart(product, selectedSize, selectedColor, 1);
            setIsAdded(true);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
            {/* Product Image Area */}
            <Link href={`/product/${product.category}/${product.id}`} className="block relative aspect-[1/1.1] overflow-hidden p-1 md:p-2">
                <div className="relative w-full h-full overflow-hidden rounded-xl">
                    {/* Wishlist Button */}
                    <div className="absolute top-[1px] right-[1px] md:top-4 md:right-4 z-20 pointer-events-none">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(product);
                            }}
                            className={`pointer-events-auto p-2 md:p-2.5 rounded-lg md:rounded-xl backdrop-blur-md transition-all shadow-sm border border-black/5 group/heart ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-neutral-800/90 text-black dark:text-white hover:bg-white'
                                }`}
                        >
                            <Heart
                                size={14}
                                fill={isWishlisted ? 'currentColor' : 'none'}
                                className={`transition-all duration-300 md:w-4 md:h-4 ${isWishlisted ? 'scale-110' : 'group-hover/heart:scale-110'}`}
                            />
                        </button>
                    </div>

                    {/* Main Image */}
                    <Image
                        src={displayImage}
                        alt={product.name}
                        width={400}
                        height={440}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${hoverImage ? 'group-hover:opacity-0 group-hover:scale-110' : 'group-hover:scale-110'
                            }`}
                    />

                    {/* Hover Image */}
                    {hoverImage && (
                        <Image
                            src={hoverImage}
                            alt={product.name}
                            width={400}
                            height={440}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out scale-105 group-hover:scale-110"
                        />
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="pb-2 px-1.5 md:px-3 flex flex-col flex-grow">
                <div className="mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">{product.category}</span>
                </div>

                <Link href={`/product/${product.category}/${product.id}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base leading-tight mb-2 hover:text-orange-600 transition-colors line-clamp-1 uppercase tracking-tight">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex-grow flex flex-col space-y-3">
                    {/* Variants & Rating Row */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5 min-h-[24px]">
                            {colorOptions && colorOptions.values.map((value, index) => {
                                const isSelected = selectedOptions[colorOptions.name] === value;
                                const colorHex = extractColor(value);

                                return (
                                    <button
                                        key={value}
                                        onClick={(e) => handleOptionSelect(e, colorOptions.name, value)}
                                        className={`w-5 h-5 rounded-full border transition-all relative overflow-hidden p-0.5 ${isSelected
                                            ? 'border-orange-600 scale-110 shadow-[0_0_8px_rgba(234,88,12,0.3)]'
                                            : 'border-gray-200 dark:border-neutral-700 hover:scale-110'
                                            } ${index >= 3 ? 'hidden' : index === 2 ? 'hidden md:block' : 'block'}`}
                                        title={value}
                                    >
                                        <div
                                            className="w-full h-full rounded-full"
                                            style={{ backgroundColor: colorHex }}
                                        />
                                    </button>
                                );
                            })}

                            {/* Dynamic +N Indicator */}
                            {colorOptions && colorOptions.values.length > 2 && (
                                <>
                                    {/* Mobile Indicator (Shown if > 2) */}
                                    {colorOptions.values.length > 2 && (
                                        <span className="text-[10px] font-bold text-gray-500 md:hidden">
                                            +{colorOptions.values.length - 2}
                                        </span>
                                    )}
                                    {/* Desktop Indicator (Shown if > 3) */}
                                    {colorOptions.values.length > 3 && (
                                        <span className="text-[10px] font-bold text-gray-500 hidden md:block">
                                            +{colorOptions.values.length - 3}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-black text-gray-900 dark:text-white">{rating}</span>
                            <span className="text-[10px] text-gray-400 font-bold">({reviewCount})</span>
                        </div>
                    </div>

                    {/* Price & Add Button */}
                    <div className="flex items-center justify-between gap-2 pt-0 mt-auto">
                        <div className="flex flex-col">
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-[10px] md:text-sm text-gray-400 line-through">
                                    <Price amount={product.originalPrice} />
                                </span>
                            )}
                            <div className="text-[14px] md:text-lg text-gray-900 dark:text-white">
                                <Price amount={selectedVariant ? parseFloat(selectedVariant.price.amount) : product.price} />
                            </div>
                        </div>

                        <button
                            onClick={handleAddToBag}
                            disabled={isAdding}
                            className={`h-8 md:h-10 px-2 md:px-4 rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-lg ${isAdded
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isAdding ? (
                                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : isAdded ? (
                                <>
                                    <Check size={14} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    Done
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={14} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    <span className="md:hidden">Add</span>
                                    <span className="hidden md:inline">Buy Now</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
