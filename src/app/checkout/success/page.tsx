"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, ShoppingBag, Mail } from 'lucide-react';
import { motion } from 'motion/react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-10 text-green-500"
                >
                    <CheckCircle size={48} />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
                        Thank You!
                    </h1>
                    <p className="text-neutral-500 text-lg mb-12 font-medium">
                        Your order has been placed successfully and is now being processed.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left"
                >
                    <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-3 mb-2 text-neutral-400">
                            <Package size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Order Number</span>
                        </div>
                        <p className="text-xl font-black uppercase tracking-tight">#{orderId || 'N/A'}</p>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-3 mb-2 text-neutral-400">
                            <Mail size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Confirmation</span>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-tight">Sent to your email</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/shop"
                        className="bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-100 transition-all"
                    >
                        <ShoppingBag size={18} />
                        Continue Shopping
                    </Link>
                    <Link
                        href="/"
                        className="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                        Go to Homepage
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-[10px] text-neutral-400 mt-20 uppercase tracking-[0.3em] font-medium"
                >
                    Premium Tech Gear • OQHUBS
                </motion.p>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
            </main>
        }>
            <SuccessContent />
        </Suspense>
    );
}
