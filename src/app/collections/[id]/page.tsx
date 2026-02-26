"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/types';
import CollectionClient from './CollectionClient';

interface CollectionData {
    products: Product[];
    collections: { id: string; title: string; handle: string }[];
}

export default function CollectionPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams();
    const [data, setData] = useState<CollectionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function fetchCollection() {
            try {
                const baseParams = new URLSearchParams(searchParams.toString());
                const activeCollection = baseParams.get('category') || params.id;
                baseParams.set('collection', activeCollection);

                const res = await fetch(`/api/collections/products?${baseParams.toString()}`);
                if (!res.ok) {
                    throw new Error('Failed to load collection');
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

        fetchCollection();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id, searchParams.toString()]);

    if (isLoading) {
        return <div className="min-h-screen animate-pulse bg-gray-50" />;
    }

    if (hasError || !data) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-gray-500">
                    Unable to load this collection. Please try adjusting your filters or refresh the page.
                </p>
            </main>
        );
    }

    return (
        <Suspense fallback={<div className="min-h-screen animate-pulse bg-gray-50" />}>
            <CollectionClient
                initialProducts={data.products}
                categories={data.collections}
                initialCollection={params.id}
            />
        </Suspense>
    );
}

