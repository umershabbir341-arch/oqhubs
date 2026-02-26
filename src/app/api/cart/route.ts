import { NextResponse } from 'next/server';
import { createCart } from '@/lib/woocommerce';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { lines } = body;

        if (!lines || !Array.isArray(lines)) {
            return NextResponse.json({ error: 'Invalid cart lines' }, { status: 400 });
        }

        const cartData = await createCart(lines);
        return NextResponse.json(cartData);
    } catch (error) {
        console.error('Cart API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
