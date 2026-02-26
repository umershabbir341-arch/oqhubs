"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import CollectionClient from '../collections/[id]/CollectionClient';

interface SearchClientProps {
    allProducts: any[];
    categories: any[];
}

export default function SearchClient({ allProducts, categories }: SearchClientProps) {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    // Filter products based on search query client-side
    const searchResults = query
        ? allProducts.filter((product: any) => {
            const searchLower = query.toLowerCase();
            return (
                product.name?.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower) ||
                product.category?.toLowerCase().includes(searchLower)
            );
        })
        : allProducts;

    return (
        <CollectionClient
            initialProducts={searchResults}
            categories={categories}
            initialCollection="search"
        />
    );
}
