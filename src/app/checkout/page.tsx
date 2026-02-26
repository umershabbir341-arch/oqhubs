"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Loader2, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';

export default function CheckoutPage() {
    const { cartItems, totalAmount, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        postcode: '',
        country: 'PK',
        phone: ''
    });

    const handleFormChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        // Simple loading delay for smoother entry
        const timer = setTimeout(() => setIsInitialLoading(false), 500);

        if (cartItems.length === 0 && !isProcessing) {
            router.push('/cart');
        }
        return () => clearTimeout(timer);
    }, [cartItems, router, isProcessing]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0 || isProcessing) return;

        setIsProcessing(true);
        try {
            const orderData = {
                billing: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address_1: formData.address1,
                    address_2: formData.address2,
                    city: formData.city,
                    postcode: formData.postcode,
                    country: formData.country,
                    email: formData.email,
                    phone: formData.phone
                },
                shipping: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address_1: formData.address1,
                    address_2: formData.address2,
                    city: formData.city,
                    postcode: formData.postcode,
                    country: formData.country
                },
                line_items: cartItems.map(item => ({
                    product_id: parseInt(item.shopifyId || item.id),
                    variation_id: item.variantId ? parseInt(item.variantId) : undefined,
                    quantity: item.quantity
                })),
                shipping_lines: [
                    {
                        method_id: 'flat_rate',
                        method_title: 'Flat Rate',
                        total: '0.00'
                    }
                ]
            };

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderData })
            });

            const result = await response.json();

            if (response.ok && result.id) {
                clearCart();
                router.push(`/checkout/success?orderId=${result.id}`);
            } else {
                throw new Error(result.message || 'Failed to place order');
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(`Error: ${error.message}`);
            setIsProcessing(false);
        }
    };

    if (isInitialLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white dark:bg-black pt-[100px] md:pt-[140px] pb-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <Link href="/cart" className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors mb-4 group w-fit">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Bag
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">
                            Checkout
                        </h1>
                    </div>

                    <div className="flex items-center gap-6 text-neutral-400 px-6 py-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={18} className="text-green-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">SSL Secure</span>
                        </div>
                        <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
                        <div className="flex items-center gap-2 text-black dark:text-white">
                            <Lock size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Form Section */}
                    <div className="lg:col-span-7">
                        <CheckoutForm formData={formData} onChange={handleFormChange} />

                        <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800">
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="group relative w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm overflow-hidden hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-white/10 dark:bg-black/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                                <span className="relative flex items-center justify-center gap-3">
                                    {isProcessing ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            Place Order
                                            <ShieldCheck size={18} />
                                        </>
                                    )}
                                </span>
                            </button>
                            <p className="text-center text-[10px] text-neutral-500 mt-6 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                                <Lock size={12} />
                                Secure connection established
                            </p>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-5 relative">
                        <CheckoutSummary />
                    </div>
                </form>
            </div>
        </main>
    );
}
