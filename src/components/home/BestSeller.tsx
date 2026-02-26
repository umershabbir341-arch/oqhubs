"use client";

import React from 'react';
import ProductCard from '@/components/common/ProductCard';
import { Product } from '@/types';

interface BestSellerProps {
    products: Product[];
}

const BestSeller = ({ products }: BestSellerProps) => {
    return (
        <section className="py-4 sm:py-8 lg:py-12 bg-white dark:bg-neutral-950">
            <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-[600px] mb-8 sm:mb-12 lg:mb-[50px]">
                    <h2 className="text-[32px] sm:text-4xl lg:text-[48px] font-black uppercase text-black dark:text-white mb-4 sm:mb-5">BEST SELLERS</h2>
                    <p className="text-sm sm:text-base leading-[1.6] text-[#666666] dark:text-neutral-400">
                        Our most loved pieces—curated for quality, style, and performance.<br className="hidden sm:block" />
                        See why these are the top choices of the season.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-8 lg:gap-10">
                    {products?.slice(4, 8).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSeller;
