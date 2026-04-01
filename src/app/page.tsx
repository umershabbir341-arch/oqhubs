import nextDynamic from "next/dynamic";
import PromotionalBento from "@/components/home/PromotionalBento";
import FeaturedSlider from "@/components/home/FeaturedSlider";
import JoinMovement from "@/components/home/JoinMovement";
import WhyShopWithUs from "@/components/home/WhyShopWithUs";
import BentoGrid from "@/components/home/BentoGrid";
import BestSeller from "@/components/home/BestSeller";
import FeaturedSaleSection from "@/components/home/FeaturedSaleSection";
import TabbedProductSection from "@/components/home/TabbedProductSection";
import {
    getAllProducts,
    getProductsByCategoryName,
    transformWooProduct,
} from '@/lib/woocommerce';

const HeroSection = nextDynamic(() => import("@/components/home/HeroSection"), {
    ssr: false,
});

export default async function Home() {
    // Parallel data fetching on server
    const [headphonesWoo, watchesWoo, earbudsWoo] = await Promise.all([
        getProductsByCategoryName('Headphones & Neckband'),
        getProductsByCategoryName('Watches'),
        getProductsByCategoryName('Earbuds')
    ]);

    const baseWooProducts = headphonesWoo && headphonesWoo.length > 0 ? headphonesWoo : await getAllProducts();
    const products = baseWooProducts.map(transformWooProduct);
    const watchesProducts = (watchesWoo || []).map(transformWooProduct);
    const earbudsProducts = (earbudsWoo || []).map(transformWooProduct);

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

