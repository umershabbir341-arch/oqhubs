"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Sparkles, Star, Music } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#050505] text-white pt-20 pb-24 md:pb-0 overflow-hidden">
            <div className="max-w-[100vw] mx-auto px-6 sm:px-8 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Link href="/" className="font-black text-3xl tracking-tighter uppercase text-zinc-100 no-underline w-fit hover:text-white transition-colors">
                            OQHUB
                        </Link>

                        <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">
                            STREETWEAR FOR THE BOLD, BUILT FOR THE MOVEMENT.
                        </p>

                        <p className="text-zinc-400 text-sm leading-relaxed max-w-[350px]">
                            Inspired by the raw energy of the streets, we create statement pieces that blend style, attitude, and individuality.
                        </p>

                        <p className="text-zinc-600 text-xs mt-4 uppercase tracking-widest">
                            © 2026 Copyright
                        </p>
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:block lg:col-span-2"></div>

                    {/* Shop Column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">SHOP</h3>
                        <div className="flex flex-col gap-4 text-zinc-500">
                            <Link href="/collections/watches" className="hover:text-white transition-colors">Smart Watches</Link>
                            <Link href="/collections/earbuds" className="hover:text-white transition-colors">Earbuds</Link>
                            <Link href="/collections/headphones-neckband" className="hover:text-white transition-colors">Headphones</Link>
                            <Link href="/collections/new-arrivals" className="hover:text-white transition-colors">Vision 2026</Link>
                        </div>
                    </div>

                    {/* Account Column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">ACCOUNT</h3>
                        <div className="flex flex-col gap-4 text-zinc-500">
                            <Link href="/profile" className="hover:text-white transition-colors">My Profile</Link>
                            <Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
                            <Link href="/search" className="hover:text-white transition-colors">Search</Link>
                            <Link href="/login" className="hover:text-white transition-colors">Login / Register</Link>
                        </div>
                    </div>

                    {/* Social Column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">SOCIAL</h3>
                        <div className="flex flex-col gap-4 text-zinc-500">
                            <Link href="https://www.instagram.com/oqhub24?igsh=MXZ1cW45d3NwbDN6bA==" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors group">
                                <Instagram size={18} className="group-hover:text-white transition-colors" />
                                <span>Instagram</span>
                            </Link>
                            <Link href="https://www.google.com/search?sca_esv=eb31b015fd5c8452&rlz=1C1CHBF_enPK1128PK1128&sxsrf=ANbL-n4AuJgezaxSlhqvgoo1TBVjwq2s0g:1771771277877&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOfBeQS2kDvKi7wSj4ELMTd1IuJZs9Ch8NXyILIuR69grzaPeflQ7t4NfEqMp0asO3zZ4aOrEgVsNkk-Dlq5gVEYIeHHR&q=OQ+HUB+Reviews&sa=X&ved=2ahUKEwiZnJCtqu2SAxWH6jgGHVp7E_AQ0bkNegQIORAH&biw=1422&bih=659&dpr=1.35" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors group">
                                <Star size={18} className="group-hover:text-white transition-colors" />
                                <span>Reviews</span>
                            </Link>
                            <Link href="https://www.facebook.com/share/1T827gKe27/" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors group">
                                <Facebook size={18} className="group-hover:text-white transition-colors" />
                                <span>Facebook</span>
                            </Link>
                            <Link href="https://www.tiktok.com/@oqhub1?_r=1&_t=ZS-948NAlZGwxG" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors group">
                                <Music size={18} className="group-hover:text-white transition-colors" />
                                <span>Tiktok</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Massive Watermark Text */}
            <div className="w-full flex items-end justify-center leading-[0.99] overflow-hidden select-none pointer-events-none px-4">
                <h1 className="text-[25vw] sm:text-[20vw] font-black text-[#151515] tracking-tighter text-center -mb-[1.5vw]">
                    OQHUB
                </h1>
            </div>
        </footer>
    );
};

export default Footer;
