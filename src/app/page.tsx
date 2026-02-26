"use client";

import { useEffect, useState } from "react";
import nextDynamic from "next/dynamic";
import PromotionalBento from "@/components/home/PromotionalBento";
import FeaturedSlider from "@/components/home/FeaturedSlider";
import JoinMovement from "@/components/home/JoinMovement";
import WhyShopWithUs from "@/components/home/WhyShopWithUs";
import BentoGrid from "@/components/home/BentoGrid";
import BestSeller from "@/components/home/BestSeller";
import FeaturedSaleSection from "@/components/home/FeaturedSaleSection";
import TabbedProductSection from "@/components/home/TabbedProductSection";
import type { Product } from "@/types";

const HeroSection = nextDynamic(() => import("@/components/home/HeroSection"), {
    ssr: false,
});

interface HomeData {
    products: Product[];
    watchesProducts: Product[];
    earbudsProducts: Product[];
}

export default function Home() {
    const [data, setData] = useState<HomeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function fetchHomeData() {
            try {
                const res = await fetch("/api/home");
                if (!res.ok) {
                    throw new Error("Failed to load home data");
                }
                const json = await res.json();
                if (isMounted) {
                    setData(json);
                    setHasError(false);
                }
            } catch (error) {
                console.error(error);
                if (isMounted) {
                    setHasError(true);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchHomeData();

        return () => {
            isMounted = false;
        };
    }, []);

    const products = data?.products ?? [];
    const watchesProducts = data?.watchesProducts ?? [];
    const earbudsProducts = data?.earbudsProducts ?? [];

    if (isLoading) {
        return (
            <main>
                <div className="min-h-screen animate-pulse bg-gray-50" />
            </main>
        );
    }

    if (hasError) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-gray-500">
                    Something went wrong while loading products. Please try again.
                </p>
            </main>
        );
    }

    return (
        <main>
            <HeroSection />
            <BentoGrid products={products} />
            <BestSeller products={products} />
            <FeaturedSaleSection products={products} />
            <TabbedProductSection
                firstCategoryProducts={watchesProducts}
                secondCategoryProducts={earbudsProducts}
                firstCategoryLabel="Watches"
                secondCategoryLabel="Earbuds"
            />
            <PromotionalBento />
            <FeaturedSlider products={products} />
            <JoinMovement />
            <WhyShopWithUs />
        </main>
    );
}

