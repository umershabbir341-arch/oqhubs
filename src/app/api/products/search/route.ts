export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { searchProducts, transformWooProduct } from '@/lib/woocommerce';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json([]);
    }

    try {
        const wooProducts = await searchProducts(query);
        const products = wooProducts.map(transformWooProduct);
        return NextResponse.json(products);
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
