"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import FilterDropdown from '@/components/product/FilterDropdown';
import MobileFilterSheet from '@/components/product/MobileFilterSheet';
import ProductCard from '@/components/common/ProductCard';
import { X, SlidersHorizontal } from 'lucide-react';
import Button from '@/components/common/Button';
import { useCurrency } from '@/context/CurrencyContext';
import Price from '@/components/common/Price';

interface CollectionClientProps {
    initialProducts: any[];
    categories: any[];
    initialCollection: string;
}

export default function CollectionClient({ initialProducts, categories, initialCollection }: CollectionClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { formatPrice } = useCurrency();

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || initialCollection);
    const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
    const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
    const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get('price') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8);
    const loaderRef = useRef<HTMLDivElement>(null);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedSize) params.set('size', selectedSize); else params.delete('size');
        if (selectedColor) params.set('color', selectedColor); else params.delete('color');
        if (selectedType) params.set('type', selectedType); else params.delete('type');
        if (selectedPriceRange) params.set('price', selectedPriceRange); else params.delete('price');
        if (sortBy !== 'newest') params.set('sort', sortBy); else params.delete('sort');
        if (selectedCategory !== initialCollection) params.set('category', selectedCategory); else params.delete('category');

        const queryString = params.toString();
        const url = queryString ? `${pathname}?${queryString}` : pathname;

        router.replace(url, { scroll: false });
    }, [selectedSize, selectedColor, selectedType, selectedPriceRange, sortBy, selectedCategory, pathname, router, searchParams, initialCollection]);

    const handleClearAll = () => {
        setSelectedSize('');
        setSelectedColor('');
        setSelectedType('');
        setSelectedPriceRange('');
        setSelectedCategory(initialCollection);
        setSortBy('newest');
    };

    const activeFiltersCount = [
        selectedSize,
        selectedColor,
        selectedType,
        selectedPriceRange,
        selectedCategory !== initialCollection ? selectedCategory : ''
    ].filter(Boolean).length;

    // Extract dynamic filter options
    const filterOptions = useMemo(() => {
        const sizes = new Set<string>();
        const colors = new Set<string>();
        const types = new Set<string>();

        initialProducts.forEach(p => {
            p.sizes?.forEach((s: string) => sizes.add(s));
            p.colors?.forEach((c: string) => colors.add(c));
            if (p.category) types.add(p.category);
        });

        return {
            sizes: Array.from(sizes).sort(),
            colors: Array.from(colors).sort(),
            types: Array.from(types).sort(),
            priceRanges: [
                `${formatPrice(0)} - ${formatPrice(50)}`,
                `${formatPrice(50)} - ${formatPrice(100)}`,
                `${formatPrice(100)} - ${formatPrice(200)}`,
                `${formatPrice(200)}+`
            ]
        };
    }, [initialProducts, formatPrice]);

    const collectionName = useMemo(() => {
        if (selectedCategory === 'search') return 'SEARCH RESULTS';
        if (selectedCategory === 'all') return 'ALL COLLECTIONS';
        if (selectedCategory === 'new-arrivals') return 'NEW ARRIVALS';
        if (selectedCategory === 'best-sellers') return 'BEST SELLERS';
        const cat = categories.find(c => c.handle === selectedCategory);
        return cat ? `${cat.title} COLLECTION` : `${selectedCategory.replace(/-/g, ' ')} COLLECTION`;
    }, [selectedCategory, categories]);

    const filteredProducts = useMemo(() => {
        // Since initialProducts is already filtered in some cases, we keep it simple
        // If sorting logic existed, we would apply it here
        return initialProducts;
    }, [initialProducts]);

    const displayedProducts = useMemo(() => {
        return filteredProducts.slice(0, visibleCount);
    }, [filteredProducts, visibleCount]);

    const hasMore = visibleCount < filteredProducts.length;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    // Small timeout to simulate loading or just to be safe
                    setTimeout(() => {
                        setVisibleCount(prev => prev + 8);
                    }, 200);
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore]);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(8);
    }, [selectedCategory, selectedSize, selectedColor, selectedType, selectedPriceRange, sortBy]);

    return (
        <div className="pb-[40px] pt-[40px] ">
            <div className=" bg-white text-black">
                <div className="mx-auto px-4 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <nav className="flex items-center gap-2 text-[0.85rem] text-[#888]">
                            <Link href="/" className="text-[#888] transition-colors hover:text-black">Home</Link>
                            <span>/</span>
                            <span className="text-black font-semibold">{collectionName.replace(' COLLECTION', '')}</span>
                        </nav>
                        <h1 className="text-[2.5rem] sm:text-[3.5rem] font-extrabold tracking-tighter m-0 uppercase leading-[1.1]">{collectionName.replace(' COLLECTION', '')}</h1>
                    </div>

                    {selectedCategory === 'new-arrivals' && (
                        <div className="pb-2">
                            <Button
                                text="Shop Latest"
                                size="sm"
                                variant="black"
                                showArrow={false}
                                onClick={() => {
                                    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mx-auto px-4 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-y border-[#f0f0f0] mt-5 gap-4 md:gap-0">
                    {/* Desktop Filters */}
                    <div className="hidden md:flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span className="text-[0.85rem] font-bold text-black mr-2">Filter by</span>

                        <FilterDropdown
                            label="Size"
                            options={filterOptions.sizes}
                            selected={selectedSize}
                            onSelect={setSelectedSize}
                        />

                        <FilterDropdown
                            label="Color"
                            options={filterOptions.colors}
                            selected={selectedColor}
                            onSelect={setSelectedColor}
                        />

                        <FilterDropdown
                            label="Price"
                            options={filterOptions.priceRanges}
                            selected={selectedPriceRange}
                            onSelect={setSelectedPriceRange}
                        />

                        <FilterDropdown
                            label="Type"
                            options={filterOptions.types}
                            selected={selectedType}
                            onSelect={setSelectedType}
                        />

                        <FilterDropdown
                            label="Category"
                            options={categories.map(c => c.title)}
                            selected={categories.find(c => c.handle === selectedCategory)?.title || (selectedCategory === 'all' ? '' : selectedCategory)}
                            onSelect={(val) => {
                                const handle = categories.find(c => c.title === val)?.handle || 'all';
                                setSelectedCategory(handle);
                            }}
                        />
                    </div>

                    {/* Mobile Filter Button */}
                    <div className="md:hidden flex items-center justify-between w-full">
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                        >
                            <SlidersHorizontal size={16} />
                            Filter
                            {activeFiltersCount > 0 && (
                                <span className="bg-white text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] ml-1">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-[0.75rem] font-bold text-black mr-1">Sort by</span>
                            <FilterDropdown
                                label="Sort"
                                options={['Most Popular', 'Price: Low to High', 'Price: High to Low']}
                                selected={sortBy === 'newest' ? 'Most Popular' : sortBy === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}
                                onSelect={(val) => {
                                    if (val === 'Most Popular') setSortBy('newest');
                                    else if (val === 'Price: Low to High') setSortBy('price-low');
                                    else if (val === 'Price: High to Low') setSortBy('price-high');
                                    else setSortBy('newest');
                                }}
                            />
                        </div>
                    </div>

                    {/* Desktop Sort */}
                    <div className="hidden md:flex items-center gap-3 flex-wrap">
                        <span className="text-[0.85rem] font-bold text-black mr-2">Sort by</span>
                        <FilterDropdown
                            label="Sort"
                            options={['Most Popular', 'Price: Low to High', 'Price: High to Low']}
                            selected={sortBy === 'newest' ? 'Most Popular' : sortBy === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}
                            onSelect={(val) => {
                                if (val === 'Most Popular') setSortBy('newest');
                                else if (val === 'Price: Low to High') setSortBy('price-low');
                                else if (val === 'Price: High to Low') setSortBy('price-high');
                                else setSortBy('newest');
                            }}
                        />
                    </div>
                </div>

                <MobileFilterSheet
                    isOpen={isMobileFilterOpen}
                    onClose={() => setIsMobileFilterOpen(false)}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                    filterOptions={filterOptions}
                    selectedSize={selectedSize}
                    onSizeSelect={setSelectedSize}
                    selectedColor={selectedColor}
                    onColorSelect={setSelectedColor}
                    selectedPriceRange={selectedPriceRange}
                    onPriceSelect={setSelectedPriceRange}
                    onClearAll={handleClearAll}
                />

                {activeFiltersCount > 0 && (
                    <div className="flex items-center flex-wrap gap-3 py-8">
                        {selectedSize && (
                            <div className="flex items-center gap-2 bg-[#f0f2f5] px-4 py-1.5 rounded-lg text-[0.85rem] font-bold text-[#334155] transition-all hover:bg-[#e2e8f0]">
                                {selectedSize}
                                <span className="cursor-pointer text-[#64748b] flex items-center justify-center transition-colors hover:text-black" onClick={() => setSelectedSize('')}><X size={12} /></span>
                            </div>
                        )}
                        {selectedColor && (
                            <div className="flex items-center gap-2 bg-[#f0f2f5] px-4 py-1.5 rounded-lg text-[0.85rem] font-bold text-[#334155] transition-all hover:bg-[#e2e8f0]">
                                {selectedColor}
                                <span className="cursor-pointer text-[#64748b] flex items-center justify-center transition-colors hover:text-black" onClick={() => setSelectedColor('')}><X size={12} /></span>
                            </div>
                        )}
                        {selectedPriceRange && (
                            <div className="flex items-center gap-2 bg-[#f0f2f5] px-4 py-1.5 rounded-lg text-[0.85rem] font-bold text-[#334155] transition-all hover:bg-[#e2e8f0]">
                                {selectedPriceRange}
                                <span className="cursor-pointer text-[#64748b] flex items-center justify-center transition-colors hover:text-black" onClick={() => setSelectedPriceRange('')}><X size={12} /></span>
                            </div>
                        )}
                        {selectedType && (
                            <div className="flex items-center gap-2 bg-[#f0f2f5] px-4 py-1.5 rounded-lg text-[0.85rem] font-bold text-[#334155] transition-all hover:bg-[#e2e8f0]">
                                {selectedType}
                                <span className="cursor-pointer text-[#64748b] flex items-center justify-center transition-colors hover:text-black" onClick={() => setSelectedType('')}><X size={12} /></span>
                            </div>
                        )}
                        {selectedCategory !== initialCollection && selectedCategory !== 'all' && (
                            <div className="flex items-center gap-2 bg-[#f0f2f5] px-4 py-1.5 rounded-lg text-[0.85rem] font-bold text-[#334155] transition-all hover:bg-[#e2e8f0]">
                                {categories.find(c => c.handle === selectedCategory)?.title || selectedCategory}
                                <span className="cursor-pointer text-[#64748b] flex items-center justify-center transition-colors hover:text-black" onClick={() => setSelectedCategory(initialCollection)}><X size={12} /></span>
                            </div>
                        )}
                        <button className="text-[0.85rem] font-semibold text-[#64748b] underline bg-transparent border-none p-0 cursor-pointer ml-2 transition-colors hover:text-black" onClick={handleClearAll}>Clear all</button>
                    </div>
                )}

                <div id="product-grid" className="pt-14 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 mb-10">
                    {displayedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {hasMore && (
                    <div ref={loaderRef} className="flex justify-center items-center py-20 mb-[100px]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading more products...</p>
                        </div>
                    </div>
                )}

                {filteredProducts.length === 0 && (
                    <div className="text-center py-[120px] text-[#999]">
                        <p>No products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
