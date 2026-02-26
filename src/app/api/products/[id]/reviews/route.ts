import { NextRequest, NextResponse } from 'next/server';
import { getProductReviews } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const productId = params.id;
        const reviews = await getProductReviews(productId);

        return NextResponse.json(reviews, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error: any) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
