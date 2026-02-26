'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';

interface FeaturedSaleSectionProps {
    products: Product[];
}

export default function FeaturedSaleSection({ products }: FeaturedSaleSectionProps) {
    // Take only first 4 products
    const featuredProducts = products.slice(0, 4);

    return (
        <section className="max-w-[95vw] mx-auto py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Hero Image */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 min-h-[400px] md:min-h-[500px] group">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/BentoImages/placeholder-hero.jpg"
                            alt="Vision 2025"
                            fill
                            className="object-cover opacity-80"
                        />
                    </div>

                    <div className="relative h-full flex flex-col justify-center items-start p-8 md:p-12 text-white z-10">
                        <span className="text-base md:text-lg font-medium opacity-90 mb-4">Vision 2026</span>
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Rethinking<br />Possibilities
                        </h2>
                        <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-2">
                            Read more
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Right Side - 4 Product Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                    {featuredProducts.map((product, index) => {
                        const categories = ['For Fashion', 'For Adventure', 'For your Lifestyle', 'For Productivity'];

                        return (
                            <Link
                                key={product.id}
                                href={`/product/${product.category}/${product.id}`}
                                className="group"
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-neutral-800 hover:shadow-xl transition-all duration-300 p-6 flex flex-col h-full">
                                    {/* Category Title */}
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                            {categories[index] || product.name}
                                        </h3>
                                        <div className="bg-gray-900 dark:bg-neutral-700 text-white rounded-full p-2 group-hover:scale-110 transition-transform">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>

                                    {/* Product Image */}
                                    <div className="relative aspect-square mt-auto">
                                        <Image
                                            src={product.image || '/placeholder.jpg'}
                                            alt={product.name}
                                            fill
                                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
