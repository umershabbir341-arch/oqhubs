'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, ChevronDown, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from './UserAvatar';
import Swal from 'sweetalert2';

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { customer, logout } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsOpen(false);
        const result = await Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to sign out of your account?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            color: '#000000'
        });

        if (result.isConfirmed) {
            logout();
        }
    };

    if (!customer) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center group transition-all"
            >
                <UserAvatar firstName={customer.firstName} lastName={customer.lastName} size="sm" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-white border border-black/5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden z-[1100]"
                    >
                        <div className="p-4 border-b border-black/5 flex items-center gap-3">
                            <UserAvatar firstName={customer.firstName} lastName={customer.lastName} size="md" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-black leading-tight">{customer.firstName} {customer.lastName}</span>
                                <span className="text-xs text-zinc-500 truncate max-w-[140px]">{customer.email}</span>
                            </div>
                        </div>

                        <div className="p-2">
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-black hover:bg-zinc-50 transition-colors group"
                            >
                                <UserCircle className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
                                Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors group"
                            >
                                <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-600 transition-colors" />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserDropdown;
