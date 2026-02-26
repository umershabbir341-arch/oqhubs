import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/common/Providers";
import NextTopLoader from 'nextjs-toploader';
import ConditionalWrapper from "@/components/layout/ConditionalWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "OQHUBS | Premium Streetwear",
    description: "Wear the movement, break the mold.",
};

export const viewport: Viewport = {
    themeColor: "#000000",
    colorScheme: 'dark',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable}`} suppressHydrationWarning>
            <body>
                <NextTopLoader
                    color="#ffffff"
                    initialPosition={0.08}
                    crawlSpeed={400}
                    height={1}
                    crawl={true}
                    showSpinner={false}
                    easing="ease"
                    speed={400}
                    shadow="0 0 10px #ffffff,0 0 5px #ffffff"
                />
                <Providers>
                    <ConditionalWrapper>
                        {children}
                    </ConditionalWrapper>
                </Providers>
            </body>
        </html>
    );
}
