'use client';

import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { motion } from 'motion/react';

import Link from 'next/link';

export default function LoginPage() {
    return (
        <main className="min-h-screen p-4 flex flex-col items-center justify-center relative overflow-hidden bg-white text-black">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-black/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-zinc-200/50 rounded-full blur-[120px]" />
            </div>

            {/* Brand Logo */}
            <Link href="/" className="mb-12 relative z-10">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-black">
                    OQHUBS
                </h2>
            </Link>

            <div className="w-full flex justify-center relative z-10">
                <LoginForm />
            </div>

            {/* Footer-like simple navigation */}
            <div className="mt-12 text-zinc-400 text-[10px] font-medium tracking-[0.2em] uppercase">
                © 2026 OQHUBS. ALL RIGHTS RESERVED.
            </div>
        </main>
    );
}
