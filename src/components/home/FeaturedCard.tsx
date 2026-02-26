"use client";

import React from 'react';
import Image from 'next/image';

interface FeaturedProduct {
    id: string;
    name: string;
    description: string;
    image: string;
}

interface FeaturedCardProps {
    product: FeaturedProduct;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ product }) => {
    return (
        <div className="relative rounded-[20px] overflow-hidden h-[400px] sm:h-[500px] lg:h-[620px] flex flex-col justify-end group">
            <Image src={product.image} alt={product.name} fill className="absolute top-0 left-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
            <div className="relative z-20 p-[30px] text-white">
                <h3 className="text-2xl font-extrabold uppercase mb-0 leading-[1.1] line-clamp-1">{product.name}</h3>
            </div>
        </div>
    );
};

export default FeaturedCard;
