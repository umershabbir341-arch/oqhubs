'use client';

import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Hero from '@/components/home/Hero';
import { motion, AnimatePresence } from 'motion/react';

const HeroSection = () => {
    const [activeColor, setActiveColor] = useState('#FAB805');

    const handleColorChange = (color: string) => {
        if (color !== activeColor) {
            setActiveColor(color);
        }
    };


    return (
        <div className="relative overflow-hidden">
            {/* Dynamic Background Gradient */}
            <AnimatePresence>
                <motion.div
                    key={activeColor}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, ${activeColor} 60%, white 100%)`
                    }}
                />
            </AnimatePresence>

            {/* Content Wrapper */}
            <div className="relative z-10">
                <Navbar colorClassName="text-white" />
                <Hero onColorChange={handleColorChange} />
            </div>
        </div>
    );
};

export default HeroSection;
