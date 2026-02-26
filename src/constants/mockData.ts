export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    sizes: string[];
    colors: string[];
}

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'SHADOW DRIP',
        category: 'HOODIES',
        price: 89,
        originalPrice: 129,
        description: 'A sleek, minimalist hoodie with dark tones and subtle reflective accents for an effortless street vibe.',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#1a1a1a', '#2d2d2d', '#4a4a4a']
    },
    {
        id: '2',
        name: 'URBAN PHANTOM',
        category: 'HOODIES',
        price: 89,
        originalPrice: 129,
        description: 'Urban Phantom - A bold, oversized hoodie with edgy graphics and a stealthy aesthetic inspired by city nights.',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#000000', '#1c1c1c']
    },
    {
        id: '3',
        name: 'NEON REBELLION',
        category: 'HOODIES',
        price: 89,
        originalPrice: 129,
        description: 'A statement piece with vibrant neon details and rebellious street art influences for a standout look.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#ccff00', '#000000']
    }
];

export const CATEGORIES = [
    { id: '1', name: 'HOODIES', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800' },
    { id: '2', name: 'TEES', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800' },
    { id: '3', name: 'OUTERWEAR', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800' }
];

export const FEATURED_PRODUCTS = [
    {
        id: 'f1',
        name: 'BLACK SUMMER TEE',
        description: 'Stay stylish and comfortable in the CoolCore Black Summer Tee, crafted from breathable fabric perfect for warm days.',
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'f2',
        name: 'SLEEK IPHONE CASE',
        description: 'Durable and slim, the SleekGuard iPhone Case offers stylish protection against drops and scratches.',
        image: 'https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'f3',
        name: 'SPRING JACKET',
        description: 'Lightweight and versatile, the Breezolita Spring Jacket combines comfort and style to keep you cozy on breezy days.',
        image: 'https://images.unsplash.com/photo-1551028919-ac767ef10653?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'f4',
        name: 'URBAN BOMBER',
        description: 'A classic silhouette reimagined for the modern city dweller, featuring water-resistant fabric and premium hardware.',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'f5',
        name: 'STREET RUNNER',
        description: 'Performance meets street style with these responsive, cushioned sneakers designed for the urban jungle.',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop'
    }
];
