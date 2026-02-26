import { NextResponse } from 'next/server';
import { getCollections } from '@/lib/woocommerce';

export async function GET() {
    try {
        const categories = await getCollections();
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Categories API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
