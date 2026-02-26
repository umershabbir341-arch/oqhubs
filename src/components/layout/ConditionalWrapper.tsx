'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Newsletter from "@/components/common/Newsletter";
import BottomNav from "@/components/common/BottomNav";
import GlobalComponents from "@/components/common/GlobalComponents";
import CartDrawer from "@/components/common/CartDrawer";

interface ConditionalWrapperProps {
    children: React.ReactNode;
}

export default function ConditionalWrapper({ children }: ConditionalWrapperProps) {
    const pathname = usePathname();

    // Define the routes where the common components should be hidden
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/signup');
    const isHomePage = pathname === '/';

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <>
            {!isHomePage && <AnnouncementBar />}
            {!isHomePage && <Navbar />}
            {children}
            <Newsletter />
            <Footer />
            <CartDrawer />
            <BottomNav />
            <GlobalComponents />
        </>
    );
}
