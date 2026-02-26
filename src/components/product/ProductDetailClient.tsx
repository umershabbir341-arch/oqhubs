"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import {
    Heart, Share2, Truck, Shield, ArrowLeft, RotateCcw,
    CheckCircle, FileText, Package, Star, Minus, Plus, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Product } from '@/types';
import AddToCartButton from './AddToCartButton';
import Reviews from './Reviews';
import Price from '@/components/common/Price';
import CustomDropdown from '@/components/common/CustomDropdown';
import ProductCard from '@/components/common/ProductCard';

interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
}

// Helper function to extract color from variant title
function getColorFromVariantTitle(title: string): string {
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
    };

    const lowerTitle = title.toLowerCase();
    for (const [colorName, colorValue] of Object.entries(colorMap)) {
        if (lowerTitle.includes(colorName)) {
            return colorValue;
        }
    }
    return '#9CA3AF';
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Hooks
    const { addToCart, toggleCart } = useCart();
    const { toggleWishlist, isInWishlist, isInitialized } = useWishlist();
    const { formatPrice } = useCurrency();

    // State
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(
        searchParams.get('quantity') ? parseInt(searchParams.get('quantity') || '1') : 1
    );
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping' | 'reviews'>('reviews');
    const [isMounted, setIsMounted] = useState(false);

    // Generic state for all selected options
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    useEffect(() => {
        setIsMounted(true);
        if (product.options) {
            const initial: Record<string, string> = {};
            product.options.forEach(opt => {
                const urlParam = searchParams.get(opt.name.toLowerCase());
                initial[opt.name] = urlParam || opt.values[0] || '';
            });
            setSelectedOptions(initial);
        }
    }, [product.options, searchParams]);

    // Map gallery to indices
    const images = useMemo(() => {
        const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
        return gallery.map(url => ({ url, altText: product.name }));
    }, [product]);

    // Derived Variant Selection logic
    const selectedVariant = useMemo(() => {
        if (!product.variants || !product.options) return null;

        return product.variants.find((v: any) => {
            return v.selectedOptions.every((vOpt: any) => {
                const selectedValue = selectedOptions[vOpt.name];
                return selectedValue === vOpt.value;
            });
        });
    }, [product.variants, product.options, selectedOptions]);

    // Update selection when variant is clicked directly (from user code logic)
    const handleVariantClick = (variant: any) => {
        const updates: Record<string, string> = {};
        variant.selectedOptions.forEach((opt: any) => {
            updates[opt.name] = opt.value;
        });
        setSelectedOptions(prev => ({ ...prev, ...updates }));

        if (variant.image?.url) {
            const imgIndex = images.findIndex(img => img.url === variant.image.url);
            if (imgIndex !== -1) setSelectedImage(imgIndex);
        }
    };

    // Sync state with URL
    useEffect(() => {
        if (!isMounted) return;
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(selectedOptions).forEach(([name, value]) => {
            params.set(name.toLowerCase(), value);
        });
        params.set('quantity', quantity.toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [selectedOptions, quantity, pathname, router, searchParams, isMounted]);

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else {
            setQuantity(prev => (prev > 1 ? prev - 1 : 1));
        }
    };

    const handleBuyNow = () => {
        const missingOptions = product.options?.filter(opt => !selectedOptions[opt.name]) || [];

        if (missingOptions.length > 0) {
            Swal.fire({
                title: 'Selection Required',
                text: `Please select ${missingOptions.map(o => o.name).join(' and ')} before buying.`,
                icon: 'warning',
                confirmButtonColor: '#000'
            });
            return;
        }

        const sizeValue = selectedOptions['Size'] || selectedOptions['size'] || '';
        const colorValue = selectedOptions['Color'] || selectedOptions['color'] || '';
        addToCart(product, sizeValue, colorValue, quantity);
        toggleCart();
    };

    const isWishlisted = (isMounted && isInitialized) ? isInWishlist(product.id) : false;

    return (
        <div className="w-full bg-white dark:bg-neutral-900 transition-colors duration-300">
            <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Product Images */}
                    <div className="w-full lg:w-[50%] space-y-4 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative w-full max-w-[100%] aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
                        >
                            <Image
                                src={images[selectedImage]?.url || '/placeholder.jpg'}
                                alt={images[selectedImage]?.altText || product.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                                priority
                            />
                            {product.originalPrice && product.originalPrice > product.price && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
                                    -{discountPercentage}%
                                </div>
                            )}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-neutral-800/90 text-gray-900 dark:text-white'
                                    }`}
                            >
                                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>
                        </motion.div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-5 sm:grid-cols-7 gap-3 w-full max-w-[100%]">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-orange-600 ring-2 ring-orange-100'
                                            : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={`${product.name} - ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className="w-full lg:w-[50%] space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-orange-600 font-bold tracking-widest text-xs uppercase">{product.category}</span>
                                <div className="flex items-center gap-1">
                                    <div className="flex text-amber-500">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={14} fill="currentColor" />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500 ml-1">84 reviews</span>
                                </div>
                            </div>



                            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white font-playfair pt-2">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-4 pt-2">
                                <div className="text-2xl font-black text-gray-900 dark:text-white">
                                    <Price amount={selectedVariant ? parseFloat(selectedVariant.price.amount) : product.price} />
                                </div>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <div className="text-xl text-gray-400 line-through">
                                        <Price amount={product.originalPrice} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Secret Code Banner */}
                        <div className="bg-gradient-to-r from-orange-700 to-yellow-500 text-white p-3 rounded-xl flex items-center justify-between shadow-lg relative overflow-hidden group">
                            <div className="z-10 flex items-center gap-2">
                                <span className="text-sm font-medium">Get <span className="text-yellow-400 font-bold">free shipping</span> on every item. Limited time offer</span>
                            </div>
                            <div className="z-10 bg-yellow-400 text-orange-900 font-bold px-3 py-1 rounded text-sm flex items-center gap-1 cursor-pointer hover:bg-yellow-300 transition-colors">
                                FREE
                                <Share2 size={14} />
                            </div>
                            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-in-out" />
                        </div>

                        {/* Analytics social proof */}
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#EBF5EE] dark:bg-green-900/20 flex items-center justify-center">
                                <TrendingUp className="w-3.5 h-3.5 text-[#2E7D32] dark:text-green-400" />
                            </div>
                            <span className="text-[13px] font-medium text-[#2E7D32] dark:text-green-400">
                                <span className="font-bold">1260+</span> People viewed this in the last 7 days
                            </span>
                        </div>

                        {/* Variations */}
                        <div className="space-y-6">
                            {product.options?.map((option) => (
                                <div key={option.name} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-sm tracking-wider uppercase">
                                            {option.name}: <span className="text-gray-500 dark:text-gray-400 font-medium normal-case ml-2">{selectedOptions[option.name]}</span>
                                        </h3>
                                    </div>

                                    {/* Show dropdown if more than 8 options, otherwise show buttons */}
                                    {option.values.length > 8 ? (
                                        <CustomDropdown
                                            value={selectedOptions[option.name] || option.values[0]}
                                            options={option.values}
                                            onChange={(val) => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                                            label={option.name}
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-3">
                                            {option.values.map((value, idx) => {
                                                const isColor = option.name.toLowerCase().includes('color');
                                                const isSelected = selectedOptions[option.name] === value;

                                                if (isColor) {
                                                    const colorHex = getColorFromVariantTitle(value);
                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${isSelected
                                                                ? 'border-orange-600 scale-110 shadow-md ring-2 ring-orange-100 dark:ring-orange-900/30'
                                                                : 'border-orange-200 dark:border-neutral-700 hover:border-orange-400'
                                                                }`}
                                                            style={{ padding: '2px' }}
                                                            aria-label={`Select ${option.name} ${value}`}
                                                        >
                                                            <div
                                                                className="w-full h-full rounded-full border border-black/5"
                                                                style={{ backgroundColor: colorHex }}
                                                            />
                                                        </button>
                                                    );
                                                }

                                                return (
                                                    <button
                                                        key={value}
                                                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 ${isSelected
                                                            ? 'border-orange-600 bg-orange-600 text-white'
                                                            : 'border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-400 hover:border-orange-400'
                                                            }`}
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 dark:border-neutral-700 rounded-xl h-[58px] bg-white dark:bg-neutral-800 overflow-hidden shrink-0">
                                    <button
                                        onClick={() => handleQuantityChange('decrease')}
                                        className="w-12 h-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-xl font-medium"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <div className="text-center font-black text-gray-900 dark:text-white w-10 text-lg">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => handleQuantityChange('increase')}
                                        className="w-12 h-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-xl font-medium"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        const missingOptions = product.options?.filter(opt => !selectedOptions[opt.name]) || [];

                                        if (missingOptions.length > 0) {
                                            Swal.fire({
                                                title: 'Selection Required',
                                                text: `Please select ${missingOptions.map(o => o.name).join(' and ')} before adding to cart.`,
                                                icon: 'warning',
                                                confirmButtonColor: '#000'
                                            });
                                            return;
                                        }
                                        const sizeValue = selectedOptions['Size'] || selectedOptions['size'] || '';
                                        const colorValue = selectedOptions['Color'] || selectedOptions['color'] || '';
                                        addToCart(product, sizeValue, colorValue, quantity);
                                    }}
                                    className="flex-1 bg-orange-600 text-white h-[58px] rounded-xl font-black tracking-widest hover:bg-orange-700 transition-all transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 uppercase"
                                >
                                    <Package size={20} />
                                    Add to Cart
                                </button>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                className="w-full bg-black dark:bg-white text-white dark:text-black h-[58px] rounded-xl font-black tracking-widest hover:opacity-90 transition-all transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 uppercase animate-shake"
                            >
                                Buy it Now
                            </button>

                            {/* Bulk Order Banner */}
                            <div className="relative mt-8 pt-4 pb-1">
                                <div className="absolute -top-1 left-6 z-10">
                                    <span className="bg-[#1A1C1E] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                        Bulk Order
                                    </span>
                                </div>
                                <div
                                    onClick={() => window.open('https://wa.me/923221262194', '_blank')}
                                    className="bg-[#FFF1E6] border border-[#FF9F66] rounded-xl p-6 flex items-center justify-between group cursor-pointer hover:bg-[#FFE8D6] transition-all duration-300"
                                >
                                    <h3 className="text-xl md:text-2xl font-semibold text-[#1A1C1E] font-playfair">
                                        Corporate Deal
                                    </h3>
                                    <div className="flex items-center gap-2 text-[#7D5A44] font-bold text-sm uppercase tracking-wide">
                                        CLICK TO ENQUIRE
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                            {[
                                { icon: CheckCircle, label: "1 Month", sub: "Warranty" },
                                { icon: Truck, label: "Free", sub: "Shipping" },
                                { icon: Shield, label: "100%", sub: "Secure" },
                                { icon: RotateCcw, label: "7 Days", sub: "Return" }
                            ].map((badge, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center border border-gray-100 dark:border-neutral-700 text-gray-600 dark:text-gray-400">
                                        <badge.icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="text-[10px] font-black uppercase leading-tight tracking-widest text-gray-900 dark:text-white">
                                        {badge.label}<br />{badge.sub}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabbed Content */}
                <div className="mt-16 border-t border-gray-100 dark:border-neutral-800">
                    <div className="flex overflow-x-auto no-scrollbar gap-8 py-6 items-center justify-center md:justify-center">
                        {[
                            { id: 'description', label: 'Description', icon: FileText },
                            { id: 'specifications', label: 'Specs', icon: Package },
                            { id: 'shipping', label: 'Shipping', icon: Truck },
                            { id: 'reviews', label: 'Reviews', icon: Star }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 font-black uppercase tracking-widest text-xs transition-all border-b-2 ${activeTab === tab.id
                                    ? 'text-black dark:text-white border-orange-600'
                                    : 'text-gray-400 border-transparent hover:text-gray-600'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="py-12 max-w-none">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'description' && (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6">About this product</h2>
                                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                                    </div>
                                )}

                                {activeTab === 'specifications' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Technical Specifications</h2>
                                        <div className="grid gap-4">
                                            {[
                                                { label: 'Category', value: product.category },
                                                { label: 'Sizes', value: product.sizes.join(', ') },
                                                { label: 'Stock', value: 'In Stock' }
                                            ].map((spec, i) => (
                                                <div key={i} className="flex justify-between py-3 border-b border-gray-100 dark:border-neutral-800">
                                                    <span className="font-bold text-gray-500 uppercase text-xs tracking-widest">{spec.label}</span>
                                                    <span className="font-black text-sm">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'shipping' && (
                                    <div className="space-y-8">
                                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Shipping & Returns</h2>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <h3 className="font-bold uppercase text-sm tracking-widest text-orange-600 flex items-center gap-2">
                                                    <Truck size={18} /> Shipping info
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                    Free standard shipping on all orders. Expected delivery time 3-5 business days.
                                                    Express shipping available at checkout.
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="font-bold uppercase text-sm tracking-widest text-orange-600 flex items-center gap-2">
                                                    <RotateCcw size={18} /> Returns policy
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                    Return any unused item in its original packaging within 30 days for a full refund.
                                                    Return shipping is covered for defective items.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <Reviews productId={product.shopifyId} productTitle={product.name} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24">
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.slice(0, 4).map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
