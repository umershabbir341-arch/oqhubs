"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/common/Button';

const PromotionalBento = () => {
    return (
        <section className="py-4 sm:py-8 lg:py-12 bg-white">
            <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 sm:mb-12 lg:mb-[50px]">
                    <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] font-black uppercase text-black mb-3 sm:mb-5 leading-tight sm:leading-none">ELEVATE YOUR TECH<br className="hidden sm:block" /> LIFESTYLE</h2>
                    <p className="text-sm sm:text-base leading-[1.6] text-[#666666]">
                        Premium smartwatches, headphones, and earbuds designed for the<br className="hidden lg:block" />
                        modern lifestyle. Experience innovation meets style.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                    {/* Top Row */}
                    <div className="lg:col-span-7 rounded-[20px] sm:rounded-[30px] overflow-hidden relative h-[280px] sm:h-[350px] lg:h-[420px] bg-[#f5f5f5] group">
                        <Image
                            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop"
                            alt="Premium Headphones"
                            fill
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    <div className="lg:col-span-5 rounded-[20px] sm:rounded-[30px] overflow-hidden relative min-h-[280px] sm:min-h-[250px] bg-[#0c0c0c] text-white">
                        <div className="p-6 sm:p-8 h-full flex flex-col justify-end items-start">
                            <h3 className="text-xl sm:text-2xl font-extrabold uppercase mb-2 sm:mb-3 leading-tight">SOUND THAT MOVES YOU</h3>
                            <p className="text-xs sm:text-sm leading-relaxed text-white/70 max-w-[250px]">
                                Crystal-clear audio meets premium comfort. Discover our latest wireless headphones.
                            </p>
                            <Button
                                text="Explore Collection"
                                variant="white"
                                size="md"
                                className="mt-2 sm:mt-4"
                            />
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="lg:col-span-5 rounded-[20px] sm:rounded-[30px] overflow-hidden relative min-h-[280px] sm:min-h-[250px] bg-[#e5e5e5] text-black">
                        <div className="p-6 sm:p-8 h-full flex flex-col justify-end items-start">
                            <h3 className="text-xl sm:text-2xl font-extrabold uppercase mb-2 sm:mb-3 leading-tight text-black">CUTTING-EDGE TECHNOLOGY</h3>
                            <p className="text-xs sm:text-sm leading-relaxed text-black/70 max-w-[250px]">
                                From smartwatches to earbuds, explore the future of wearable tech.
                            </p>
                            <Button
                                text="Shop Now"
                                variant="black"
                                size="md"
                                className="mt-2 sm:mt-4"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-7 h-[280px] sm:h-[350px] lg:h-[420px] rounded-[20px] sm:rounded-[30px] overflow-hidden relative bg-[#f5f5f5] group">
                        <Image
                            src="/images/smartwatch.png"
                            alt="Premium Smartwatch"
                            fill
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionalBento;
