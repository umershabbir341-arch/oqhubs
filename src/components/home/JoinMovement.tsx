"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Button from '@/components/common/Button';

const JoinMovement = () => {
    return (
        <section className="relative min-h-[420px] sm:h-[500px] lg:h-[700px] w-full max-w-[97vw] overflow-hidden flex items-center mx-auto px-4 sm:px-6 lg:px-8 rounded-[20px] sm:rounded-[40px] mt-4 sm:mt-8 lg:mt-12">
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=2000&auto=format&fit=crop"
                    alt="Smartwatch Technology"
                    fill
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent mix-blend-multiply" />
            </div>

            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-[800px]">
                    <h2 className="text-[36px] sm:text-[50px] lg:text-[100px] font-black leading-[0.9] text-white uppercase mb-6 sm:mb-[30px] font-sans tracking-[-1px] sm:tracking-[-2px]">
                        TECH THAT<br className="sm:hidden" />
                        MOVES.<br />
                        SOUND THAT<br className="sm:hidden" />
                        INSPIRES.
                    </h2>
                    <p className="text-sm sm:text-lg leading-[1.6] text-white/90 mb-4 sm:mb-10 max-w-[500px]">
                        Premium smartwatches, headphones, and earbuds designed for those who demand excellence.
                        Limited collections, cutting-edge features, and superior quality.
                    </p>
                    <Button
                        text="Discover Now"
                        size="md"
                        variant="white"
                    />
                </div>
            </div>
        </section>
    );
};

export default JoinMovement;
