"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchClient from './SearchClient';
import type { Product } from '@/types';

interface SearchData {
    products: Product[];
    categories: { id: string; title: string; handle: string }[];
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<SearchData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function fetchSearch() {
            try {
                const query = searchParams.get('q') || '';

                const [productsRes, categoriesRes] = await Promise.all([
                    query
                        ? fetch(`/api/products/search?q=${encodeURIComponent(query)}`).then((r) => r.json())
                        : Promise.resolve([]),
                    fetch('/api/woo/categories').then((r) => r.json()),
                ]);

                if (isMounted) {
                    setData({
                        products: productsRes || [],
                        categories: categoriesRes || [],
                    });
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

        fetchSearch();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.toString()]);

    if (isLoading) {
        return <div className="min-h-screen animate-pulse bg-gray-50" />;
    }

    if (hasError || !data) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-gray-500">
                    Unable to load search results. Please try again.
                </p>
            </main>
        );
    }

    return (
        <Suspense fallback={<div className="min-h-screen animate-pulse bg-gray-50" />}>
            <SearchClient
                allProducts={data.products}
                categories={data.categories}
            />
        </Suspense>
    );
}

