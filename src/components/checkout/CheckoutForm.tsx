"use client";

import React from 'react';
import { Mail, User, MapPin, Globe, Phone, Building } from 'lucide-react';

interface CheckoutFormProps {
    formData: any;
    onChange: (field: string, value: string) => void;
}

export default function CheckoutForm({ formData, onChange }: CheckoutFormProps) {
    return (
        <div className="space-y-10">
            {/* Contact Information */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-black dark:text-white">
                        <Mail size={16} />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Contact Information</h3>
                </div>
                <div className="grid gap-4">
                    <div className="relative group">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest absolute left-4 top-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="e.g. your@email.com"
                            value={formData.email}
                            onChange={(e) => onChange('email', e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pt-7 pb-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Shipping Address */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-black dark:text-white">
                        <MapPin size={16} />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Shipping Address</h3>
                </div>
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest absolute left-4 top-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                                First Name
                            </label>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => onChange('firstName', e.target.value)}
                                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pt-7 pb-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest absolute left-4 top-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                                Last Name
                            </label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => onChange('lastName', e.target.value)}
                                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pt-7 pb-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest absolute left-4 top-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                            Street Address
                        </label>
                        <input
                            type="text"
                            placeholder="123 Street Name"
                            value={formData.address1}
                            onChange={(e) => onChange('address1', e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pt-7 pb-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest absolute left-4 top-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                            Apartment, suite, etc. (optional)
                        </label>
                        <input
                            type="text"
                            placeholder="Unit 1, Floor 2"
                            value={formData.address2}
                            onChange={(e) => onChange('address2', e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pt-7 pb-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest absolute left-4 top-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                                City
                            </label>
                            <input
                                type="text"
                                placeholder="City"
                                value={formData.city}
                                onChange={(e) => onChange('city', e.target.value)}
                                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pt-7 pb-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest absolute left-4 top-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                                Postcode / ZIP
                            </label>
                            <input
                                type="text"
                                placeholder="Postcode"
                                value={formData.postcode}
                                onChange={(e) => onChange('postcode', e.target.value)}
                                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pt-7 pb-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest absolute left-4 top-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                            Country / Region
                        </label>
                        <select
                            value={formData.country}
                            onChange={(e) => onChange('country', e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pt-7 pb-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all appearance-none shadow-sm cursor-pointer"
                        >
                            <option value="PK">Pakistan</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="UAE">United Arab Emirates</option>
                        </select>
                        <Globe size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest absolute left-4 top-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="+92 300 1234567"
                            value={formData.phone}
                            onChange={(e) => onChange('phone', e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pt-7 pb-3 px-4 rounded-xl text-sm font-medium focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
                            required
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
