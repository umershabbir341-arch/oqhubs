"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import type { Product } from '@/types';

interface ProductDetailData {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetailPage() {
    const params = useParams<{ collection: string; id: string }>();
    const [data, setData] = useState<ProductDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/detail?handle=${encodeURIComponent(params.id)}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        if (isMounted) {
                            setData(null);
                            setHasError(false);
                        }
                        return;
                    }
                    throw new Error('Failed to load product');
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

        if (params?.id) {
            fetchProduct();
        }

        return () => {
            isMounted = false;
        };
    }, [params?.id]);

    if (isLoading) {
        return <div className="min-h-screen animate-pulse bg-gray-50" />;
    }

    if (hasError) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-gray-500">
                    Unable to load this product. Please refresh the page or try again later.
                </p>
            </main>
        );
    }

    if (!data?.product) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-gray-500">Product not found.</p>
            </main>
        );
    }

    return (
        <Suspense fallback={<div className="min-h-screen animate-pulse bg-gray-50" />}>
            <ProductDetailClient
                product={data.product}
                relatedProducts={data.relatedProducts}
            />
        </Suspense>
    );
}

