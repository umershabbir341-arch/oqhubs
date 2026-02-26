import { NextResponse } from 'next/server';
import { getShopData } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const shopData = await getShopData();
        return NextResponse.json(shopData);
    } catch (error) {
        console.error('Shop API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
