"use client";

import React from 'react';
import { IMAGES } from '@/constants/images';

const PromotionalGrid = () => {
    return (
        <section className="py-20">
            <div className="max-w-[100vw] mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                    <div className="relative rounded-[30px] overflow-hidden h-[400px] lg:h-[600px] group">
                        <img src={IMAGES.PROMO_1} alt="Promo Large" className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105" />
                        <div className="absolute top-0 left-0 w-full h-full p-12 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent text-white">
                            <span className="text-[0.8rem] font-bold tracking-[0.2rem] text-white mb-4">LIMITED EDITION</span>
                            <h2 className="text-[3rem] font-black mb-8 leading-none">UNLEASH YOUR <br />INNER STRENGTH</h2>
                            <button className="bg-white text-black border-none px-8 py-4 font-bold rounded-[5px] cursor-pointer w-fit transition-transform hover:scale-105">EXPLORE NOW</button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="relative rounded-[30px] overflow-hidden flex-1 h-[300px] group">
                            <img src={IMAGES.PROMO_2} alt="Promo Small" className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105" />
                            <div className="absolute top-0 left-0 w-full h-full p-12 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent text-white">
                                <h3 className="text-[1.5rem] font-extrabold mb-2">SEASONAL SALE</h3>
                                <p>UP TO 40% OFF</p>
                            </div>
                        </div>

                        <div className="relative rounded-[30px] overflow-hidden flex-1 h-[300px] bg-[#111] flex items-center justify-center text-center text-white">
                            <div className="relative p-12 flex flex-col justify-center items-center h-full w-full">
                                <h3 className="text-[1.5rem] font-extrabold mb-2">JOIN RAW CLUB</h3>
                                <p>Get exclusive benefits and early access.</p>
                                <button className="bg-transparent text-white border border-white px-6 py-3 mt-6 font-semibold cursor-pointer rounded-[5px] hover:bg-white hover:text-black transition-colors duration-300">SIGN UP</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionalGrid;
