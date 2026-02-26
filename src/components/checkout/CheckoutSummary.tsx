"use client";

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Price from '@/components/common/Price';
import { ShieldCheck, Truck, ReceiptText } from 'lucide-react';

export default function CheckoutSummary() {
    const { cartItems, totalAmount } = useCart();

    const shipping = 0; // Free shipping as per cart page
    const taxes = totalAmount * 0.05; // Dummy 5% tax for display
    const finalTotal = totalAmount + shipping + taxes;

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 md:p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ReceiptText className="text-neutral-400" size={20} />
                Order Summary
            </h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                {cartItems.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-neutral-800 flex-shrink-0 border border-neutral-100 dark:border-neutral-800">
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate uppercase tracking-tight">{item.name}</h4>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                                {item.selectedSize} / {item.selectedColor} × {item.quantity}
                            </p>
                        </div>
                        <div className="text-sm font-bold">
                            <Price amount={item.price * item.quantity} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex justify-between text-sm text-neutral-500 font-medium">
                    <span>Subtotal</span>
                    <Price amount={totalAmount} />
                </div>
                <div className="flex justify-between text-sm text-neutral-500 font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">Free</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500 font-medium">
                    <span>Estimated Tax (5%)</span>
                    <Price amount={taxes} />
                </div>
                <div className="flex justify-between text-xl font-black pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-2">
                    <span>Total</span>
                    <Price amount={finalTotal} />
                </div>
            </div>

            {/* Payment Method - COD Only */}
            <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-3 mb-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    <ShieldCheck size={16} className="text-green-500" />
                    Payment Method
                </div>
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white">
                        <Truck size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-tight">Cash on Delivery</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Default Method</p>
                    </div>
                </div>
                <p className="text-[10px] text-neutral-500 mt-6 leading-relaxed text-center font-medium uppercase tracking-widest">
                    Pay with cash when your order is delivered to your doorstep.
                </p>
            </div>
        </div>
    );
}
