'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';
import UserAvatar from '@/components/auth/UserAvatar';
import { motion, AnimatePresence } from 'motion/react';
import {
    Package,
    MapPin,
    Settings,
    Heart,
    ShoppingBag,
    User,
    Bell,
    ShieldCheck,
    ChevronRight,
    ArrowLeft,
    Box,
    Truck,
    CheckCircle2,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import Price from '@/components/common/Price';

// Tabs are now defined inside the component to be filtered dynamically

export default function ProfilePage() {
    const { customer, isLoading, updateProfile } = useAuth();
    const { wishlist } = useWishlist();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');

    const orders = customer?.orders || [];

    const dynamicTabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        ...(orders.length > 0 ? [{ id: 'addresses', label: 'Addresses', icon: MapPin }] : []),
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Settings state
    const [formData, setFormData] = useState({
        firstName: customer?.firstName || '',
        lastName: customer?.lastName || '',
        phone: customer?.phone || ''
    });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (customer) {
            setFormData({
                firstName: customer.firstName || '',
                lastName: customer.lastName || '',
                phone: customer.phone || ''
            });
        }
    }, [customer]);

    if (isLoading) return null;

    if (!customer) {
        if (typeof window !== 'undefined') router.push('/login');
        return null;
    }

    const getStatusInfo = (status: string) => {
        const lowerStatus = status?.toLowerCase();
        switch (lowerStatus) {
            case 'completed':
                return { label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 };
            case 'processing':
            case 'on-hold':
                return { label: 'Processing', color: 'text-blue-600', bg: 'bg-blue-50', icon: Truck };
            case 'pending':
                return { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock };
            case 'cancelled':
            case 'failed':
                return { label: 'Cancelled', color: 'text-rose-600', bg: 'bg-rose-50', icon: Box };
            default:
                return { label: status || 'Pending', color: 'text-zinc-600', bg: 'bg-zinc-50', icon: Package };
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { id: 'orders', label: 'Total Orders', value: orders.length.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { id: 'orders', label: 'Completed Orders', value: orders.filter((o: any) => o.status === 'completed' || o.status === 'COMPLETED').length.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { id: 'wishlist', label: 'Wishlist Items', value: wishlist.length.toString(), icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
                            ].map((stat, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(stat.id)}
                                    className="p-6 rounded-3xl bg-white border border-black/5 flex items-center justify-between group hover:shadow-xl hover:shadow-black/[0.02] transition-all text-left"
                                >
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">{stat.label}</p>
                                        <p className="text-3xl font-black text-black">{stat.value}</p>
                                    </div>
                                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={24} />
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Recent Orders Preview */}
                        {orders.length > 0 && (
                            <div className="p-8 rounded-3xl bg-white border border-black/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold uppercase tracking-widest">Recent Orders</h3>
                                    <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-zinc-400 hover:text-black transition-colors uppercase tracking-widest">View All</button>
                                </div>
                                <div className="space-y-4">
                                    {orders.slice(0, 3).map((order: any) => {
                                        const status = getStatusInfo(order.status);
                                        return (
                                            <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-black/[0.03] hover:border-black/10 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl ${status.bg} ${status.color} flex items-center justify-center`}>
                                                        <status.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-black">Order #{order.number}</p>
                                                        <p className="text-xs text-zinc-500">{new Date(order.date_created).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Price amount={parseFloat(order.total)} className="text-sm font-black text-black" />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>{status.label}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="p-8 rounded-3xl bg-black text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Member Rewards</h3>
                                <p className="text-zinc-400 text-sm mb-6 max-w-md">You're 500 points away from unlocking your next exclusive reward. Keep shopping to earn more!</p>
                                <button className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-colors">
                                    View Rewards
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'orders':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order: any) => {
                                    const status = getStatusInfo(order.status);
                                    return (
                                        <div key={order.id} className="p-8 rounded-3xl bg-white border border-black/5 hover:border-black/10 transition-all">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-black/5">
                                                <div className="flex items-center gap-6">
                                                    <div className={`p-4 rounded-2xl ${status.bg} ${status.color}`}>
                                                        <status.icon size={28} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Order Number</p>
                                                        <h4 className="text-2xl font-black text-black">#{order.number}</h4>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-10">
                                                    <div>
                                                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Date</p>
                                                        <p className="font-bold text-black">{new Date(order.date_created).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Total</p>
                                                        <Price amount={parseFloat(order.total)} className="font-bold text-black" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-zinc-100 ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                                <div className="flex -space-x-4 overflow-hidden">
                                                    {order.line_items.map((item: any, i: number) => (
                                                        <div key={i} className="w-16 h-16 rounded-xl border-4 border-white bg-zinc-100 overflow-hidden shadow-sm relative group cursor-pointer">
                                                            <img
                                                                src={item.image?.src || '/images/placeholder.jpg'}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-[8px] text-white font-black uppercase text-center px-1 leading-tight">{item.name}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.line_items.length > 5 && (
                                                        <div className="w-16 h-16 rounded-xl border-4 border-white bg-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-xs shadow-sm">
                                                            +{order.line_items.length - 5}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-end gap-3">
                                                    <button className="px-6 py-3 border border-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">Order Details</button>
                                                    <button className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors">Track Order</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-12 rounded-3xl bg-white border border-black/5 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center">
                                    <Package size={32} className="text-zinc-300" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold uppercase tracking-widest">No Orders Yet</h3>
                                    <p className="text-sm text-zinc-500 max-w-xs mx-auto mb-6">Explore our collections and make your first order today!</p>
                                    <Link href="/collections/all" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors">
                                        Start Shopping <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                );
            case 'wishlist':
                const { toggleWishlist, isInitialized } = useWishlist();

                if (!isInitialized) {
                    return (
                        <div className="p-12 h-[300px] flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    );
                }

                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {wishlist.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-black pb-12">
                                {wishlist.map((item: any) => (
                                    <div key={item.id} className="relative group">
                                        <Link
                                            href={`/product/${item.category}/${item.id}`}
                                            className="p-5 rounded-[40px] bg-white border border-black/5 flex flex-col gap-5 hover:shadow-2xl hover:shadow-black/[0.05] transition-all duration-500 h-full"
                                        >
                                            <div className="w-full aspect-square rounded-[32px] overflow-hidden bg-zinc-100 relative">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            </div>
                                            <div className="space-y-2 px-1 flex-1 flex flex-col pt-1">
                                                <h4 className="text-sm font-black uppercase tracking-tighter truncate leading-tight">{item.name}</h4>
                                                <Price amount={item.price} className="text-sm font-bold text-zinc-400 mb-4" />
                                                <div className="mt-auto">
                                                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black group-hover:gap-3 transition-all">
                                                        View Product <ChevronRight size={14} />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleWishlist(item);
                                            }}
                                            className="absolute top-7 right-7 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-md z-20"
                                        >
                                            <Heart size={18} fill="currentColor" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 rounded-3xl bg-white border border-black/5 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center">
                                    <Heart size={32} className="text-zinc-300" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Your Wishlist is Empty</h3>
                                    <p className="text-sm text-zinc-500 max-w-xs mx-auto mb-6">Save the items you love to your wishlist and they will appear here.</p>
                                    <Link href="/collections/all" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors">
                                        Explore Items <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                );
            case 'settings':
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="p-8 rounded-3xl bg-white border border-black/5">
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-8">Account Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 text-black">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">First Name</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1 text-black">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 text-black">
                                    <div className="space-y-1 text-black">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Email Address</label>
                                        <input type="email" defaultValue={customer.email} disabled className="w-full px-4 py-3 bg-zinc-50/50 border-none rounded-xl text-sm font-semibold opacity-60 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-1 text-black">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+1234567890"
                                            className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                        />
                                        <p className="text-[9px] text-zinc-400 font-medium">Format: +[country code][number] (e.g. +1234567890)</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 pt-8 border-t border-black/5 flex justify-end">
                                <button
                                    onClick={async () => {
                                        setIsUpdating(true);
                                        // Final data for update
                                        const updateData: any = {
                                            firstName: formData.firstName,
                                            lastName: formData.lastName
                                        };

                                        // Only include phone if it's not empty and format it correctly
                                        if (formData.phone && formData.phone.trim() !== '') {
                                            let phone = formData.phone.trim();
                                            // Prepend + if missing and it looks like it's just the digits
                                            if (!phone.startsWith('+')) {
                                                const digits = phone.replace(/\D/g, '');
                                                if (digits.length >= 7) {
                                                    phone = `+${digits}`;
                                                }
                                            }
                                            updateData.phone = phone;
                                        }

                                        await updateProfile(updateData);
                                        setIsUpdating(false);
                                    }}
                                    disabled={isUpdating}
                                    className="px-8 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isUpdating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl bg-rose-50 border border-rose-100">
                            <h3 className="text-lg font-bold uppercase tracking-widest text-rose-900 mb-2">Danger Zone</h3>
                            <p className="text-sm text-rose-700/70 mb-6 font-semibold">Once you delete your account, there is no going back. Please be certain.</p>
                            <button className="px-6 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </motion.div>
                );
            case 'addresses':
                const billing = customer.billing;
                const shipping = customer.shipping;
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="p-8 rounded-3xl bg-white border border-black/5">
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-8">Addresses</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 rounded-2xl bg-zinc-50 border border-black/[0.03]">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-4">Billing Address</p>
                                    {billing?.address_1 ? (
                                        <div className="space-y-2">
                                            <p className="font-bold text-black">{billing.first_name} {billing.last_name}</p>
                                            <p className="text-sm text-zinc-600 font-medium">{billing.address_1}</p>
                                            {billing.address_2 && <p className="text-sm text-zinc-600 font-medium">{billing.address_2}</p>}
                                            <p className="text-sm text-zinc-600 font-medium">
                                                {billing.city}, {billing.state} {billing.postcode}
                                            </p>
                                            <p className="text-sm text-zinc-600 font-medium uppercase tracking-widest">{billing.country}</p>
                                            {billing.phone && <p className="text-sm text-zinc-600 font-medium mt-2">Phone: {billing.phone}</p>}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-zinc-400 italic">No billing address set.</p>
                                    )}
                                </div>
                                <div className="p-6 rounded-2xl bg-zinc-50 border border-black/[0.03]">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-4">Shipping Address</p>
                                    {shipping?.address_1 ? (
                                        <div className="space-y-2">
                                            <p className="font-bold text-black">{shipping.first_name} {shipping.last_name}</p>
                                            <p className="text-sm text-zinc-600 font-medium">{shipping.address_1}</p>
                                            {shipping.address_2 && <p className="text-sm text-zinc-600 font-medium">{shipping.address_2}</p>}
                                            <p className="text-sm text-zinc-600 font-medium">
                                                {shipping.city}, {shipping.state} {shipping.postcode}
                                            </p>
                                            <p className="text-sm text-zinc-600 font-medium uppercase tracking-widest">{shipping.country}</p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-zinc-400 italic">No shipping address set.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                        <p className="uppercase tracking-widest text-sm font-bold">Coming Soon</p>
                    </div>
                );
        }
    };

    return (
        <main className="min-h-screen bg-[#fafafa] lg:pt-16 pb-20 px-4 md:px-8">
            <div className="w-full">
                {/* Profile Header */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 mb-8 border border-black/5 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-100 rounded-full blur-[100px] -mr-64 -mt-64" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                        <div className="relative group">
                            <UserAvatar
                                firstName={customer.firstName}
                                lastName={customer.lastName}
                                size="lg"
                                className="w-32 h-32 md:w-40 md:h-40 text-4xl border-[6px] border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Update</span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col gap-2 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Member Since Jan 2025</span>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-black">
                                    {customer.firstName} {customer.lastName}
                                </h1>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    Verified Account
                                </div>
                                <div className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Titanium Member
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Link href="/" className="px-6 py-3 border border-black/5 rounded-2xl hover:bg-zinc-50 transition-colors text-zinc-400">
                                <ArrowLeft size={20} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                    {/* Sidebar */}
                    <aside className="space-y-2">
                        {dynamicTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'bg-black text-white shadow-xl shadow-black/10'
                                    : 'bg-white text-zinc-400 hover:text-black hover:bg-zinc-100 border border-black/5'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTab" className="ml-auto">
                                        <ChevronRight size={16} />
                                    </motion.div>
                                )}
                            </button>
                        ))}
                    </aside>

                    {/* Main Content Area */}
                    <div className="min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <div key={activeTab}>
                                {renderContent()}
                            </div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
