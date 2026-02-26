"use client";

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

import { useRouter } from 'next/navigation';
import { useUI } from '@/context/UIContext';
import Swal from 'sweetalert2';
import Price from './Price';
import { useCurrency } from '@/context/CurrencyContext';

const CartDrawer = () => {
    const router = useRouter();
    const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();
    const { formatPrice } = useCurrency();
    const { setSheetOpen } = useUI();
    const [isMobile, setIsMobile] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Detect screen size for responsive layout
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Prevent background scrolling when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        setSheetOpen('cart', isCartOpen);
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen, setSheetOpen]);

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        closeCart();
        router.push('/checkout');
    };

    const handleRemoveItem = async (id: string, size: string, color: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to remove this item from your cart?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#dc2626', // Red for Yes
            cancelButtonColor: '#000000', // Black for No
            background: '#fff',
            customClass: {
                title: 'font-black uppercase tracking-tight',
                htmlContainer: 'text-neutral-600',
                confirmButton: '!bg-red-600 !text-white rounded-xl px-8 py-3 font-bold uppercase tracking-widest hover:!bg-red-700',
                cancelButton: '!bg-black !text-white rounded-xl px-8 py-3 font-bold uppercase tracking-widest hover:!bg-gray-800',
                actions: '!gap-3',
                container: '!z-[3000]',
                popup: '!z-[3001]'
            },
            buttonsStyling: false
        });

        if (result.isConfirmed) {
            removeFromCart(id, size, color);
        }
    };

    const freeShippingGoal = 200;
    const progress = Math.min((totalAmount / freeShippingGoal) * 100, 100);

    const drawerVariants = {
        hidden: isMobile ? { y: '100%' } : { x: '100%' },
        visible: isMobile ? { y: 0 } : { x: 0 },
        exit: isMobile ? { y: '100%' } : { x: '100%' }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[2000] flex justify-end items-end md:items-stretch">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeCart}
                    />

                    {/* Drawer Content */}
                    <motion.div
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        drag={isMobile ? "y" : false}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.5 }}
                        onDragEnd={(event, info) => {
                            if (isMobile && info.offset.y > 80) {
                                closeCart();
                            }
                        }}
                        className={`relative w-full ${isMobile ? 'h-[92vh] rounded-t-[32px]' : 'max-w-md h-full'} bg-white shadow-2xl flex flex-col overflow-hidden`}
                    >
                        {/* Mobile Drag Handle */}
                        {isMobile && (
                            <div className="flex justify-center pt-3 pb-1" onClick={closeCart}>
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full opacity-50" />
                            </div>
                        )}

                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={20} className="text-primary" />
                                <h2 className="text-xl font-bold tracking-tight uppercase">Your Bag</h2>
                                <motion.span
                                    key={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="bg-primary text-secondary text-xs px-2 py-0.5 rounded-full font-bold"
                                >
                                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                </motion.span>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Shipping Progress */}
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider mb-2">
                                <span>{progress >= 100 ? 'Free Shipping Earned!' : `Spend ${formatPrice(freeShippingGoal - totalAmount)} more for free shipping`}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                                >
                                    <div className="p-6 bg-gray-50 rounded-full">
                                        <ShoppingBag size={48} className="text-gray-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Your bag is empty</h3>
                                        <p className="text-sm text-gray-500 max-w-[200px] mx-auto mt-1">
                                            Looks like you haven't added anything yet. Let's find some heat!
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeCart}
                                        className="mt-4 px-8 py-3 bg-primary text-secondary font-bold text-sm tracking-widest hover:opacity-90 transition-opacity uppercase"
                                    >
                                        Start Shopping
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            layout
                                            className="flex gap-4 group"
                                        >
                                            <div className="w-24 h-32 bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-sm tracking-tight uppercase line-clamp-1">{item.name}</h3>
                                                            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter">
                                                                {item.selectedSize} / {item.selectedColor}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{item.category}</p>
                                                </div>
                                                <div className="flex justify-between items-end mt-4">
                                                    <div className="flex items-center border border-gray-100 rounded-sm">
                                                        <button
                                                            onClick={() => {
                                                                if (item.quantity === 1) {
                                                                    handleRemoveItem(item.id, item.selectedSize, item.selectedColor);
                                                                } else {
                                                                    updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1);
                                                                }
                                                            }}
                                                            className="p-1 px-2 hover:bg-gray-50 transition-colors text-gray-500"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                                            className="p-1 px-2 hover:bg-gray-50 transition-colors text-gray-500"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <Price amount={item.price * item.quantity} className="font-black text-sm tracking-tighter" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 border-t border-gray-100 bg-gray-50/30 space-y-4 pb-10 md:pb-6"
                            >
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Subtotal</p>
                                        <p className="text-xs text-gray-400">Shipping and taxes calculated at checkout</p>
                                    </div>
                                    <motion.div
                                        key={totalAmount}
                                        initial={{ opacity: 0.5, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Price amount={totalAmount} className="text-2xl font-black tracking-tighter" />
                                    </motion.div>
                                </div>
                                <div className="pt-2">
                                    <button
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut}
                                        className="w-full flex items-center justify-center gap-2 p-5 bg-primary text-secondary font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                                    >
                                        {isCheckingOut ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <>
                                                Proceed to Checkout <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
