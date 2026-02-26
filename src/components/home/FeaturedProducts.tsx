"use client";

import React from 'react';
import ProductCard from '@/components/common/ProductCard';
import Button from '@/components/common/Button';

const FeaturedProducts = ({ products }: { products: any[] }) => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-[100vw] mx-auto px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl lg:text-[48px] font-black tracking-[-0.05em] mb-2 text-black">FEATURED HOODIES</h2>
                        <p className="text-[#666666] text-[1.1rem]">Stand out, stay ahead.</p>
                    </div>
                    <Button text="VIEW ALL" variant="black" size="sm" showArrow={false} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
                    {products?.slice(4, 8).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
