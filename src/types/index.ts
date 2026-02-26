export interface AttributeOption {
    name: string;
    values: string[];
}

export interface Product {
    id: string; // This will be the handle for Shopify products
    shopifyId: string;
    variantId?: string; // Default variant ID
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    gallery?: string[];
    sizes: string[];
    colors: string[];
    options?: AttributeOption[];
    variants?: any[];
    reviewCount?: number;
    rating?: number;
}

export interface CartItem extends Product {
    variantId: string;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

export interface Review {
    id: number;
    productId: number;
    reviewer: string;
    reviewerEmail: string;
    review: string;
    rating: number;
    dateCreated: string;
    verified: boolean;
}
