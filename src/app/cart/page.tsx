"use client";

import React from 'react';
import styles from './Cart.module.css';
import { Trash2, ShoppingBag, ArrowRight, Loader2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import Price from '@/components/common/Price';

export default function CartPage() {
    const router = useRouter();
    const { cartItems, totalAmount, removeFromCart, updateQuantity } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        router.push('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <main>
                <div className="py-[150px]">
                    <div className="container mx-auto px-4 lg:px-8 text-center text-black">
                        <ShoppingBag size={64} className="mx-auto mb-6 opacity-20" />
                        <h1 className="text-4xl font-black mb-4">YOUR BAG IS EMPTY</h1>
                        <p className="text-neutral-500 mb-8">Looks like you haven't added anything to your bag yet.</p>
                        <Link href="/shop" className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform inline-block">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-white text-black min-h-screen">
            <div className="py-[120px]">
                <div className="container mx-auto px-4 lg:px-8">
                    <h1 className="text-3xl md:text-5xl font-black mb-12 uppercase">YOUR BAG ({cartItems.length})</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16">
                        <div className="flex flex-col gap-8">
                            {cartItems.map(item => (
                                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-8 pb-8 border-b border-neutral-100 items-center">
                                    <div className="w-24 h-24 sm:w-[120px] sm:h-[120px] rounded-[15px] overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold mb-1 uppercase tracking-tight">{item.name}</h3>
                                        <p className="text-neutral-500 text-sm mb-4 uppercase tracking-wider">{item.category} | SIZE: {item.selectedSize} | COLOR: {item.selectedColor}</p>
                                        <div className="font-bold text-lg flex items-center gap-2">
                                            <Price amount={item.price} />
                                            <span>x {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex items-center border border-neutral-100 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.selectedSize!, item.selectedColor!, item.quantity - 1)}
                                                className="p-2 px-3 hover:bg-neutral-50 transition-colors text-neutral-400"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.selectedSize!, item.selectedColor!, item.quantity + 1)}
                                                className="p-2 px-3 hover:bg-neutral-50 transition-colors text-neutral-400"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.selectedSize!, item.selectedColor!)}
                                            className="text-neutral-400 hover:text-black transition-colors p-2"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="sticky top-32 p-8 sm:p-10 rounded-[25px] flex flex-col gap-6 bg-neutral-50 border border-neutral-100">
                                <h3 className="text-xl font-black mb-2 uppercase tracking-tight">ORDER SUMMARY</h3>
                                <div className="flex justify-between text-sm font-bold text-neutral-600">
                                    <span className="uppercase tracking-widest">SUBTOTAL</span>
                                    <Price amount={totalAmount} />
                                </div>
                                <div className="flex justify-between text-sm font-bold text-neutral-600">
                                    <span className="uppercase tracking-widest">SHIPPING</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-xl font-black pt-6 border-t border-neutral-200">
                                    <span>TOTAL</span>
                                    <Price amount={totalAmount} />
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full bg-black text-white p-5 rounded-xl font-bold flex items-center justify-center gap-4 text-center mt-4 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                                >
                                    {isCheckingOut ? (
                                        <Loader2 size={24} className="animate-spin" />
                                    ) : (
                                        <>
                                            CHECKOUT <ArrowRight size={24} />
                                        </>
                                    )}
                                </button>

                                <div className="flex gap-2 mt-4 pt-6 border-t border-neutral-100">
                                    <input
                                        type="text"
                                        placeholder="PROMO CODE"
                                        className="flex-1 bg-white border border-neutral-200 p-3 rounded-lg text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-black transition-colors"
                                    />
                                    <button className="bg-neutral-100 text-black px-6 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">APPLY</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
