"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// Slides Data
const SLIDES = [
    {
        id: 1,
        desktopUrl: '/images/heroImages/year-end-banner.jpg',
        mobileUrl: '/images/heroImages/year-end-banner-mob.png',
        alt: 'OQHUBS Year End Sale Apparel',
        color: '#66900A'
    },
    {
        id: 2,
        desktopUrl: '/images/heroImages/year-end-banner_1.jpeg',
        mobileUrl: '/images/heroImages/year-end-banner-mob (2).png',
        alt: 'Year End Sale Banner 2',
        color: '#881010'
    },
    {
        id: 3,
        desktopUrl: '/images/heroImages/desktop_copy_1.png',
        mobileUrl: '/images/heroImages/mobile_4.png',
        alt: 'Desktop Banner 1',
        color: '#EB7C36'
    },
    {
        id: 4,
        desktopUrl: '/images/heroImages/desktop_7.jpeg',
        mobileUrl: '/images/heroImages/mobile_7.jpeg',
        alt: 'Desktop Banner 2',
        color: '#C40808'
    }
];

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

interface HeroProps {
    onColorChange?: (color: string) => void;
}

const Hero = ({ onColorChange }: HeroProps) => {
    const [[page, direction], setPage] = useState([0, 0]);

    // Calculate the index based on the page number to support infinite paging
    const imageIndex = ((page % SLIDES.length) + SLIDES.length) % SLIDES.length;

    const paginate = useCallback((newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    }, [page]);

    // Signal color change to parent
    useEffect(() => {
        if (onColorChange) {
            onColorChange(SLIDES[imageIndex].color);
        }
    }, [imageIndex, onColorChange]);

    // Autoplay
    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 7000); // 7 seconds autoplay
        return () => clearInterval(timer);
    }, [paginate]);

    return (
        <section className="w-full flex justify-center pt-0 pb-2 sm:pb-4 overflow-hidden">
            <div className="relative w-[93vw] sm:w-[95vw] aspect-[3/5] sm:aspect-[16/9] md:aspect-[1920/738] rounded-xl sm:rounded-3xl overflow-hidden group">
                {/* Preload images to prevent transition glitches */}
                <div className="hidden" aria-hidden="true">
                    {SLIDES.map((slide) => (
                        <div key={`preload-${slide.id}`}>
                            <Image src={slide.desktopUrl} alt="" width={1} height={1} priority />
                            <Image src={slide.mobileUrl} alt="" width={1} height={1} priority />
                        </div>
                    ))}
                </div>

                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "tween", ease: "easeInOut", duration: 0.8 },
                            opacity: { duration: 0.4 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <motion.div
                            className="absolute inset-0 w-full h-full"
                            initial={{ scale: 1.05 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 8, ease: "linear" }}
                        >
                            {/* Desktop Image */}
                            <div className="relative w-full h-full hidden sm:block">
                                <Image
                                    src={SLIDES[imageIndex].desktopUrl}
                                    alt={SLIDES[imageIndex].alt}
                                    fill
                                    className="object-cover"
                                    priority={imageIndex === 0}
                                />
                            </div>
                            {/* Mobile Image */}
                            <div className="relative w-full h-full block sm:hidden">
                                <Image
                                    src={SLIDES[imageIndex].mobileUrl}
                                    alt={SLIDES[imageIndex].alt}
                                    fill
                                    className="object-cover"
                                    priority={imageIndex === 0}
                                />
                            </div>
                        </motion.div>
                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                key={`content-${imageIndex}`}
                            >

                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons (Visible on hover/touch) */}
                {/* <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                    <button
                        className="p-3 rounded-full bg-black/20 backdrop-blur-md hover:bg-white text-white hover:text-black transition-all opacity-0 group-hover:opacity-100 pointer-events-auto transform hover:scale-110 shadow-lg"
                        onClick={() => paginate(-1)}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        className="p-3 rounded-full bg-black/20 backdrop-blur-md hover:bg-white text-white hover:text-black transition-all opacity-0 group-hover:opacity-100 pointer-events-auto transform hover:scale-110 shadow-lg"
                        onClick={() => paginate(1)}
                        aria-label="Next slide"
                    >   
                        <ChevronRight size={24} />
                    </button>
                </div> */}

                {/* Dot Indicators */}
                <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                    {SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                const diff = idx - imageIndex;
                                if (diff !== 0) {
                                    setPage([page + diff, diff > 0 ? 1 : -1]);
                                }
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm backdrop-blur-sm ${idx === imageIndex
                                ? 'bg-white w-8'
                                : 'bg-white/40 w-2 hover:bg-white/80 hover:w-4'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
