"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, ChevronDown, Menu, X, Search, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { useAuth } from '@/context/AuthContext';
import UserDropdown from '../auth/UserDropdown';
import UserAvatar from '../auth/UserAvatar';
import CategoriesDropdown from './CategoriesDropdown';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

interface NavbarProps {
    colorClassName?: string;
}

const Navbar = ({ colorClassName }: NavbarProps) => {
    const { toggleCart, totalItems } = useCart();
    const { isAnySheetOpen, openSearch, openSheets, setSheetOpen } = useUI();
    const { customer, logout } = useAuth();
    const router = useRouter();
    const isMobileMenuOpen = openSheets.has('mobile-menu');

    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024); // lg is 1024px
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const setIsMobileMenuOpen = (isOpen: boolean) => {
        setSheetOpen('mobile-menu', isOpen);
    };

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const menuVariants: Variants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const linkVariants: Variants = {
        closed: { opacity: 0, y: 20 },
        open: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.1 + i * 0.1,
                duration: 0.4,
                ease: "easeOut"
            }
        })
    };

    const [categories, setCategories] = React.useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/woo/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Explicitly defined main links based on user request
    const mainNavLinks = [
        { href: "/", label: "HOME" },
        { href: "/collections/watches", label: "SMART WATCHES" },
        { href: "/collections/earbuds", label: "EARBUDS" },
        { href: "/collections/headphones-neckband", label: "HEADPHONE" },
        { href: "/collections/new-arrivals", label: "VISION 2026" },
    ];

    // Filter categories to show only those not in the main nav
    const excludedHandles = ['watches', 'earbuds', 'headphones-neckband', 'new-arrivals'];
    const remainingCategories = categories.filter(cat => !excludedHandles.includes(cat.handle));

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: (isMobile && isAnySheetOpen) ? '-100%' : 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-background/80 backdrop-blur-md text-primary h-14 lg:h-18 flex items-center relative z-[1000] w-full"
        >
            <div className="max-w-[95vw] w-full mx-auto flex justify-between items-center ">
                {/* Brand Logo */}
                <Link href="/" className={`font-sans text-3xl font-black tracking-tighter uppercase ${colorClassName || 'text-primary'} no-underline flex-shrink-0 py-2`}>
                    OQHUB
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-5 items-center font-outfit">
                    {mainNavLinks.map((link) => (
                        <motion.div
                            key={link.href}
                            className="relative py-1"
                            initial="initial"
                            whileHover="hover"
                        >
                            <Link
                                href={link.href}
                                className={`text-sm font-semibold ${colorClassName || 'text-primary'} tracking-[0.05em] flex items-center gap-1 transition-colors`}
                            >
                                {link.label}
                            </Link>
                            <motion.span
                                className="absolute bottom-0 left-0 h-[2px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                variants={{
                                    initial: { width: 0 },
                                    hover: { width: '100%' }
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ originX: 0 }}
                            />
                        </motion.div>
                    ))}

                    {/* More Accessories Dropdown */}
                    <CategoriesDropdown
                        categories={remainingCategories}
                        label="MORE ACCESSORIES"
                        colorClassName={colorClassName}
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-5">
                    <button
                        onClick={openSearch}
                        className={`hidden md:flex ${colorClassName || 'text-primary'} relative items-center bg-transparent border-none cursor-pointer hover:text-accent transition-colors`}
                        aria-label="Open Search"
                    >
                        <Search size={24} />
                    </button>

                    <div className="hidden md:flex items-center">
                        {customer ? (
                            <UserDropdown />
                        ) : (
                            <Link
                                href="/login"
                                className={`${colorClassName || 'text-primary'} hover:text-accent transition-colors`}
                                aria-label="Login"
                            >
                                <User size={24} />
                            </Link>
                        )}
                    </div>

                    <button
                        onClick={toggleCart}
                        className={`${colorClassName || 'text-primary'} relative flex items-center bg-transparent border-none cursor-pointer`}
                        aria-label="Open Cart"
                    >
                        <ShoppingCart size={24} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2.5 bg-primary text-secondary text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold animate-fade-in">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    <button
                        className={`lg:hidden bg-transparent border-none cursor-pointer ${colorClassName || 'text-primary'} flex items-center justify-center p-2`}
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open Menu"
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 w-full h-screen bg-background z-[2000] lg:hidden flex flex-col"
                    >
                        {/* Mobile Menu Header */}
                        <div className="h-16 px-6 flex justify-between items-center border-b border-primary/10">
                            <Link href="/" className="font-sans text-2xl font-black tracking-tighter uppercase text-primary no-underline" onClick={() => setIsMobileMenuOpen(false)}>
                                OQHUB
                            </Link>
                            <button
                                className="bg-transparent border-none cursor-pointer text-primary p-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close Menu"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Mobile Menu Links */}
                        <div className="flex-1 px-6 py-10 flex flex-col justify-between overflow-y-auto">
                            <nav className="flex flex-col gap-6 font-outfit">
                                {mainNavLinks.map((link, i) => (
                                    <motion.div key={link.href} custom={i} variants={linkVariants}>
                                        <Link
                                            href={link.href}
                                            className="text-2xl sm:text-3xl font-black text-primary no-underline tracking-tighter hover:text-accent transition-colors uppercase"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile More Accessories Section */}
                                {remainingCategories.length > 0 && (
                                    <motion.div custom={mainNavLinks.length} variants={linkVariants}>
                                        <div className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-4">More Accessories</div>
                                        <div className="flex flex-col gap-4 pl-4 border-l border-primary/10">
                                            {remainingCategories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/collections/${cat.handle}`}
                                                    className="text-2xl font-black text-primary/60 no-underline tracking-tighter hover:text-accent transition-colors uppercase"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {cat.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </nav>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-10 flex flex-col gap-6"
                            >
                                <div className="flex flex-col gap-4">
                                    {customer ? (
                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-center gap-4">
                                                <UserAvatar firstName={customer.firstName} lastName={customer.lastName} size="lg" />
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-black text-primary leading-tight uppercase">{customer.firstName} {customer.lastName}</span>
                                                    <span className="text-xs font-medium text-primary/40 leading-tight">{customer.email}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <Link
                                                    href="/profile"
                                                    className="text-xs font-bold text-primary uppercase tracking-widest no-underline"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    View Profile
                                                </Link>
                                                <button
                                                    onClick={async () => {
                                                        const result = await Swal.fire({
                                                            title: 'Logout?',
                                                            text: 'Are you sure you want to sign out?',
                                                            icon: 'question',
                                                            showCancelButton: true,
                                                            confirmButtonColor: '#000000',
                                                            confirmButtonText: 'Logout',
                                                            background: '#ffffff',
                                                            color: '#000000'
                                                        });
                                                        if (result.isConfirmed) {
                                                            logout();
                                                            setIsMobileMenuOpen(false);
                                                        }
                                                    }}
                                                    className="text-left text-xs font-bold text-rose-600 uppercase tracking-widest no-underline"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link href="/login" className="text-2xl sm:text-3xl font-black text-primary no-underline tracking-tighter hover:text-accent transition-colors uppercase" onClick={() => setIsMobileMenuOpen(false)}>
                                            Login
                                        </Link>
                                    )}
                                    <Link href="/contact" className="text-sm font-bold text-primary/60 uppercase tracking-widest no-underline hover:text-primary transition-colors font-outfit" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                                    <div className="text-sm font-bold text-primary/60 uppercase tracking-widest font-outfit">More Accessories</div>
                                </div>
                                <p className="text-xs text-primary/40 font-medium">© 2026 OQHUB. ALL RIGHTS RESERVED.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
