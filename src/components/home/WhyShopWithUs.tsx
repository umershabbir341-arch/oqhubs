"use client";

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const FEATURES = [
    {
        icon: <Truck size={24} />,
        title: "FREE DELIVERY",
        description: "Get your streetwear fast and free, with no extra shipping costs on all orders."
    },
    {
        icon: <ShieldCheck size={24} />,
        title: "100% SECURE PAYMENT",
        description: "Shop with confidence using encrypted, safe, and trusted payment methods."
    },
    {
        icon: <RefreshCw size={24} />,
        title: "30 DAYS RETURN",
        description: "Not the perfect fit? No worries. Return or exchange hassle-free within 30 days."
    },
    {
        icon: <Headphones size={24} />,
        title: "24/7 SUPPORT",
        description: "Got questions? Our team is here for you anytime, anywhere."
    }
];

const WhyShopWithUs = () => {
    return (
        <section className="py-4 sm:py-8 lg:py-16 bg-white text-black">
            <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20">
                <div className="flex-1 max-w-full lg:max-w-[500px]">
                    <h2 className="text-[32px] sm:text-[36px] lg:text-[60px] font-black leading-[0.95] uppercase mb-6 sm:mb-[30px] font-sans tracking-[-0.5px] sm:tracking-[-1px]">WHY SHOP WITH US?</h2>
                    <p className="text-base sm:text-lg leading-[1.6] text-[#666666]">
                        We've got you covered with hassle-free shopping, top-tier service,
                        and guarantees that keep you confident in every purchase.
                    </p>
                </div>

                <div className="flex-[1.5] grid grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-[50px]">
                    {FEATURES.map((feature, index) => (
                        <div key={index} className="flex flex-col items-start">
                            <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full border border-[#e5e5e5] flex items-center justify-center mb-5 sm:mb-[25px] text-[#333]">
                                {feature.icon}
                            </div>
                            <h3 className="text-base sm:text-lg font-extrabold uppercase mb-3 sm:mb-[15px] tracking-[-0.5px]">{feature.title}</h3>
                            <p className="text-sm sm:text-[15px] leading-[1.6] text-[#666666]">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyShopWithUs;
