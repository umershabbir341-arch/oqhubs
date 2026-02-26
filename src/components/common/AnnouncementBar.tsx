'use client';

import { useState, useEffect } from 'react';

const announcements = [
    "Free Shipping on orders above 50%",
    "Flat 20% OFF – Limited Time Only"
];

export default function AnnouncementBar() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black text-white py-2.5 overflow-hidden relative font-outfit">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm font-medium tracking-wide uppercase">
                <div className="relative h-5">
                    {announcements.map((text, index) => (
                        <div
                            key={index}
                            className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out transform ${index === currentIndex
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-full'
                                }`}
                            style={{ pointerEvents: index === currentIndex ? 'auto' : 'none' }}
                        >
                            {text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
