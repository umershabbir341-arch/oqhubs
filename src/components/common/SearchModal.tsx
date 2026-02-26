"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Search, TrendingUp, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import { useUI } from '@/context/UIContext';
import Price from './Price';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTrendingLoading, setIsTrendingLoading] = useState(false);
    const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const router = useRouter();

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (e) {
                console.error('Error parsing recent searches', e);
            }
        }
    }, [isOpen]);

    const saveSearch = (query: string) => {
        if (!query.trim()) return;
        const newSearches = [
            query.trim(),
            ...recentSearches.filter(s => s.toLowerCase() !== query.trim().toLowerCase())
        ].slice(0, 5);
        setRecentSearches(newSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
                const results = await response.json();
                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Detect screen size for responsive layout
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Fetch trending products
    useEffect(() => {
        const fetchTrending = async () => {
            if (isOpen && trendingProducts.length === 0) {
                setIsTrendingLoading(true);
                try {
                    // Using the new search API with an empty query or specific trending endpoint in future
                    const response = await fetch('/api/products/search?q=a'); // Hacky trending for now
                    const products = await response.json();
                    setTrendingProducts(products.slice(0, 2));
                } catch (error) {
                    console.error('Error fetching trending products:', error);
                } finally {
                    setIsTrendingLoading(false);
                }
            }
        };
        fetchTrending();
    }, [isOpen, trendingProducts.length]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const trendingSearches = [
        'Oversized Hoodies',
        'Vintage Denim',
        'Streetwear Basics',
        'Cargo Pants',
        'Graphic Tees'
    ];

    const quickLinks = [
        { label: 'New Arrivals', path: '/collections/new-arrivals' },
        { label: 'Best Sellers', path: '/collections/best-sellers' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            saveSearch(searchQuery);
            // Navigate to search results page
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            onClose();
        }
    };

    const handleRecentSearchClick = (query: string) => {
        saveSearch(query);
        router.push(`/search?q=${encodeURIComponent(query)}`);
        onClose();
    };

    // Responsive animation variants
    const modalVariants = {
        hidden: isMobile ? { y: '100%' } : { opacity: 0, y: -50, scale: 0.95 },
        visible: isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 },
        exit: isMobile ? { y: '100%' } : { opacity: 0, y: -50, scale: 0.95 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={`fixed inset-0 z-[2500] flex ${isMobile ? 'items-end' : 'items-start justify-center'}`}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Search Modal Content */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: 'spring', damping: 25, stiffness: isMobile ? 200 : 250 }}
                        drag={isMobile ? "y" : false}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.5 }}
                        onDragEnd={(event, info) => {
                            if (isMobile && info.offset.y > 70) {
                                onClose();
                            }
                        }}
                        className={`relative w-full ${isMobile
                            ? 'h-[92vh] rounded-t-[32px]'
                            : 'max-w-3xl mx-4 mt-20 md:mt-32 rounded-3xl max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-200px)]'
                            } bg-white shadow-2xl overflow-hidden flex flex-col`}
                    >
                        {/* Mobile Drag Handle */}
                        {isMobile && (
                            <div className="flex justify-center pt-3 pb-1" onClick={onClose}>
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                            </div>
                        )}

                        {/* Gradient Accent Bar */}
                        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary hidden md:block" />

                        {/* Search Input Section */}
                        <div className="p-6 md:p-8 border-b border-gray-100 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <form onSubmit={handleSearch} className="flex-1 w-full">
                                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 w-full ${isFocused
                                        ? 'bg-gray-50 ring-2 ring-gray-200'
                                        : 'bg-gray-50'
                                        }`}>
                                        <Search size={24} className="text-gray-600 flex-shrink-0" />
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                            placeholder="Search for products, collections, brands..."
                                            className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-gray-400"
                                        />
                                        {searchQuery && (
                                            <motion.button
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                type="button"
                                                onClick={() => setSearchQuery('')}
                                                className="p-1 hover:bg-white rounded-full transition-colors"
                                            >
                                                <X size={20} className="text-gray-400" />
                                            </motion.button>
                                        )}
                                    </div>
                                </form>
                                <button
                                    onClick={onClose}
                                    className="p-3 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 hidden md:block"
                                    aria-label="Close search"
                                >
                                    <X size={24} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Search Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 search-scrollbar">
                            {searchQuery ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm text-gray-500">
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Searching for...
                                                </span>
                                            ) : (
                                                <span>Search results for "<span className="font-bold text-primary">{searchQuery}</span>"</span>
                                            )}
                                        </p>
                                        {!isLoading && (
                                            <span className="text-xs font-bold text-gray-400">
                                                {searchResults.length} RESULTS
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid gap-4 mt-6">
                                        {!isLoading && searchResults.length > 0 ? (
                                            searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.category}/${product.id}?name=${encodeURIComponent(product.name)}&price=${product.price}&category=${encodeURIComponent(product.category)}&image=${encodeURIComponent(product.image)}`}
                                                    onClick={onClose}
                                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                                                >
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-sm uppercase tracking-tight truncate max-w-[60vw] md:max-w-none">{product.name}</h4>
                                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                            <span>{product.category}</span>
                                                            <span>•</span>
                                                            <Price amount={product.price} />
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                                                </Link>
                                            ))
                                        ) : !isLoading && (
                                            <div className="py-20 text-center">
                                                <p className="text-gray-400 font-medium">No products found matching your search.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                // Default State - Trending & Recent
                                <div className="space-y-8">
                                    {/* Quick Links */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                                            Quick Links
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {quickLinks.map((link, idx) => (
                                                <motion.div
                                                    key={link.label}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                >
                                                    <Link
                                                        href={link.path}
                                                        onClick={onClose}
                                                        className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-black/80 hover:shadow-xl transition-all duration-300"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Trending Content */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <TrendingUp size={16} className="text-primary" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                                Trending Products
                                            </h3>
                                        </div>

                                        {isTrendingLoading ? (
                                            <div className="flex items-center gap-2 py-4">
                                                <Loader2 size={16} className="animate-spin text-gray-400" />
                                                <span className="text-sm text-gray-400">Loading trends...</span>
                                            </div>
                                        ) : (
                                            <div className="grid gap-3">
                                                {trendingProducts.map((product, idx) => (
                                                    <motion.div
                                                        key={product.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                    >
                                                        <Link
                                                            href={`/product/${product.category}/${product.id}?name=${encodeURIComponent(product.name)}&price=${product.price}&category=${encodeURIComponent(product.category)}&image=${encodeURIComponent(product.image)}`}
                                                            onClick={onClose}
                                                            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                                                        >
                                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-xs uppercase tracking-tight truncate max-w-[55vw] md:max-w-none">{product.name}</h4>
                                                                <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                                                                    <span>{product.category}</span>
                                                                    <span>•</span>
                                                                    <Price amount={product.price} />
                                                                </div>
                                                            </div>
                                                            <ArrowRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Recent Searches */}
                                    {recentSearches.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Clock size={16} className="text-gray-400" />
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                                    Recent Searches
                                                </h3>
                                            </div>
                                            <div className="space-y-2">
                                                {recentSearches.map((search, idx) => (
                                                    <motion.button
                                                        key={`${search}-${idx}`}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        onClick={() => handleRecentSearchClick(search)}
                                                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors group"
                                                    >
                                                        <Clock size={16} className="text-gray-400" />
                                                        <span className="text-sm font-medium flex-1 text-left">{search}</span>
                                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bottom Gradient Accent */}
                        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50 hidden md:block" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
