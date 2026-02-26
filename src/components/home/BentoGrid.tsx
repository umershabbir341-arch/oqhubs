'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

interface BentoGridProps {
    products: any[];
}

export default function BentoGrid({ products }: BentoGridProps) {
    return (
        <section className="max-w-[95vw] mx-auto py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-fr md:auto-rows-[180px]">

                {/* 1. Main Hero Card (Sequoia) - Spans 2 cols, 2 rows */}
                <div className="col-span-2 md:col-span-2 row-span-2 bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:shadow-lg transition-shadow min-h-[350px] md:min-h-0">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <span className="inline-block px-3 py-1 bg-white dark:bg-neutral-800 rounded-full text-xs font-medium text-gray-500 mb-4">
                                🎵 Studio Quality
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-black dark:text-white">
                                Immersive Audio<br />Experience.
                            </h2>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-4xl font-bold text-transparent" style={{ WebkitTextStroke: '1px #ccc' }}>
                                    01
                                </span>
                                <div className="h-[1px] w-12 bg-gray-300 dark:bg-neutral-700"></div>
                                <p className="text-xs text-gray-500 max-w-[150px]">
                                    Crystal Clear Sound<br />
                                    Experience music exactly as the artist intended.
                                </p>
                            </div>
                        </div>

                        <button className="bg-[#D4F853] text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 w-fit hover:scale-105 transition-transform">
                            View Collection
                            <ArrowUpRight size={18} />
                        </button>
                    </div>

                    {/* Hero Image */}
                    <div className="absolute bottom-[50px] right-[60px] md:top-1/2 md:right-0 md:bottom-auto transform md:-translate-y-1/2 w-[220px] md:w-[350px] h-[220px] md:h-[400px] opacity-80 md:opacity-100 transition-all duration-500">
                        <Image
                            src="/images/BentoImages/m506t0002_11june22_earpods4-Photoroom.png"
                            alt="Sequoia Headphone"
                            width={280}
                            height={280}
                            className="object-cover w-full h-full drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* 2. Popular Colors (Top right, 1st slot) */}
                <div className="md:col-span-1 row-span-1 bg-gray-100 dark:bg-neutral-900 rounded-3xl p-6 border border-gray-200 dark:border-neutral-800 flex flex-col justify-between hover:shadow-md transition-shadow min-h-[160px] md:min-h-0">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Trending Colors</h3>
                    <div className="flex gap-2">
                        {['bg-slate-900', 'bg-neutral-200', 'bg-blue-600', 'bg-orange-500', 'bg-rose-500'].map((color, i) => (
                            <div key={i} className={`w-6 h-6 rounded-full ${color} ring-2 ring-white dark:ring-neutral-800 shadow-sm`}></div>
                        ))}
                    </div>
                </div>

                {/* 4. Midnight Series Headphone - Spans 1 col, 2 rows (Far Right) */}
                <div className="md:col-span-1 row-span-2 bg-[#F2F4F7] dark:bg-neutral-800 rounded-3xl p-6 relative overflow-hidden group hover:shadow-lg transition-shadow flex flex-col justify-end min-h-[300px] md:min-h-0">
                    <div className="absolute top-4 right-4 bg-white dark:bg-neutral-700 p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-sm">
                        <ArrowUpRight size={20} className="text-black dark:text-white" />
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full">
                        <Image
                            src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop"
                            alt="Midnight Series Headphone"
                            fill
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>

                    <div className="relative z-10 pt-32">
                        <h3 className="text-lg font-bold leading-tight mb-1 text-white">Midnight Series<br />Pro</h3>
                        <p className="text-xs text-gray-300">Deep Bass Profile</p>
                    </div>
                </div>

                {/* FIXING COL 3 ROW 2: New Gen X-Bud */}
                <div className="md:col-span-1 row-span-1 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow bg-gray-100 dark:bg-neutral-900 min-h-[180px] md:min-h-0">
                    <div className="relative z-10">
                        <h3 className="font-semibold text-gray-800 dark:text-white leading-tight">True Wireless<br />Essentials</h3>
                        <div className="bg-white dark:bg-neutral-800 rounded-full p-2 w-fit mt-8 shadow-sm border border-gray-100 dark:border-neutral-700">
                            <ArrowUpRight size={16} className="text-black dark:text-white" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-[180px] h-[160px]">
                        <Image
                            src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop"
                            alt="Wireless Earbuds"
                            fill
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 rounded-tl-3xl"
                        />
                    </div>
                </div>


                {/* BOTTOM ROW (Row 3) */}

                {/* 5. More Products - New Arrivals */}
                <div className="md:col-span-1 row-span-1 bg-gray-100 dark:bg-neutral-900 rounded-3xl p-6 border border-gray-200 dark:border-neutral-800 flex flex-col justify-between hover:shadow-md transition-shadow min-h-[180px] md:min-h-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">New Arrivals</h3>
                            <p className="text-xs text-gray-500">{products.length} plus items.</p>
                        </div>
                        <Heart size={16} className="text-red-500 fill-red-500" />
                    </div>
                    <div className="flex gap-2 mt-4">
                        {products
                            .slice(0, 3)
                            .map((product, i) => (
                                <Link
                                    key={product.id || i}
                                    href={`/product/${product.category || 'all'}/${product.id}`}
                                    className={`w-20 h-20 rounded-lg bg-white dark:bg-neutral-800 overflow-hidden hover:scale-110 transition-transform shadow-sm relative ${i > 0 ? 'hidden md:block' : ''}`}
                                >
                                    <Image
                                        src={product.image || '/placeholder.jpg'}
                                        alt={product.name || 'Product'}
                                        fill
                                        className="object-cover"
                                    />
                                </Link>
                            ))
                        }
                    </div>
                </div>

                {/* 6. 5m+ Downloads */}
                <div className="md:col-span-1 row-span-1 bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden hover:shadow-md transition-shadow min-h-[180px] md:min-h-0">
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                        <div className="flex -space-x-2 mb-3 justify-center">
                            {/* Replaced broken image links with placeholder avatars or just remove/simplify */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-800 bg-gray-300 dark:bg-neutral-700 shadow-sm flex items-center justify-center overflow-hidden">
                                    <span className="text-[8px] font-bold text-gray-500">U{i}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-blue-600 text-white rounded-full w-24 h-24 flex flex-col items-center justify-center mb-2 shadow-lg mx-auto">
                            <span className="font-bold text-lg">5m+</span>
                            <span className="text-[10px] opacity-80">Trusted Users</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-zinc-400 justify-center">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" /> 4.8 Rating
                        </div>
                    </div>
                </div>

                {/* 7. Listening Has Been Released */}
                <div className="col-span-2 md:col-span-2 row-span-1 bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow flex items-center justify-between min-h-[160px] md:min-h-0">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <span className="inline-block px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded-md w-fit">
                            ⚡ New Release
                        </span>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-white leading-tight">Portable Power<br />Series</h3>
                            <p className="text-xs text-gray-500 mt-1">Sound Anywhere, Anytime</p>
                        </div>
                    </div>

                    <div className="absolute top-4 right-4">
                        <ArrowUpRight size={18} className="text-gray-400" />
                    </div>

                    <div className="absolute right-0 bottom-0 w-[45%] h-[120%] md:h-[130%] pointer-events-none">
                        <Image
                            src="/images/BentoImages/istockphoto-1135085068-612x612-Photoroom.png"
                            alt="New Release"
                            fill
                            className="object-contain object-right-bottom drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
