"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FeaturedCard from './FeaturedCard';
const FeaturedSlider = ({ products }: { products: any[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef(0);
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>();

    // Speed in pixels per millisecond
    const speed = 0.05;

    // Duplicate products to ensure seamless looping
    // Tripling the list usually ensures we have enough buffer for a seamless reset
    const extendedProducts = products ? [...products, ...products, ...products] : [];

    const animate = useCallback((time: number) => {
        if (lastTimeRef.current !== undefined) {
            const deltaTime = time - lastTimeRef.current;

            // Move forward continuously
            scrollRef.current += speed * deltaTime;

            if (containerRef.current) {
                const container = containerRef.current;
                const totalWidth = container.scrollWidth;
                // One set of products is 1/3 of the total width since we tripled it
                const singleSetWidth = totalWidth / 3;

                // Reset if we've scrolled past the first set
                if (scrollRef.current >= singleSetWidth) {
                    scrollRef.current -= singleSetWidth;
                }
                // Handles backward scrolling manual navigation
                else if (scrollRef.current < 0) {
                    scrollRef.current += singleSetWidth;
                }

                container.style.transform = `translateX(-${scrollRef.current}px)`;
            }
        }
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [animate]);

    const handlePrev = () => {
        // Jump backward by roughly one card width (estimate or precise)
        // Assuming card width + gap approx 300px + 20px
        scrollRef.current -= 320;
    };

    const handleNext = () => {
        scrollRef.current += 320;
    };

    return (
        <section className="py-4 sm:py-8 lg:py-12 bg-white overflow-hidden">
            <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 sm:mb-12 lg:mb-[50px]">
                    <div className="max-w-[800px]">
                        <h2 className="text-[28px] sm:text-4xl lg:text-[48px] font-black uppercase text-black mb-4 sm:mb-5 leading-tight sm:leading-none">FEATURED DROPS: STAND OUT,<br className="hidden lg:block" /> STAY AHEAD</h2>
                        <p className="text-sm sm:text-base leading-[1.6] text-[#666666]">
                            Exclusive designs, premium materials, and street-ready vibes—these must-have pieces<br className="hidden lg:block" />
                            are setting the trend. Get yours before they're gone!
                        </p>
                    </div>

                    <div className="hidden md:flex gap-[15px] mt-2.5">
                        <button onClick={handlePrev} className="w-[50px] h-[50px] rounded-full border border-[#e5e5e5] bg-white text-black flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-black hover:text-white hover:border-black" aria-label="Previous">
                            <ArrowLeft size={24} />
                        </button>
                        <button onClick={handleNext} className="w-[50px] h-[50px] rounded-full border border-[#e5e5e5] bg-white text-black flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-black hover:text-white hover:border-black" aria-label="Next">
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full overflow-hidden pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-1400px)/2))]">
                <div className="flex gap-4 sm:gap-5 w-max will-change-transform" ref={containerRef}>
                    {extendedProducts.map((product, index) => (
                        <div key={`${product.id}-${index}`} className="w-[280px] sm:w-[350px] lg:w-[450px] shrink-0">
                            <FeaturedCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSlider;
