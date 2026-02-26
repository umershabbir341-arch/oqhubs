import { NextRequest, NextResponse } from 'next/server';
import { submitProductReview } from '@/lib/woocommerce';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, reviewer, reviewerEmail, review, rating } = body;

        if (!productId || !reviewer || !reviewerEmail || !review || !rating) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const result = await submitProductReview(productId, {
            reviewer,
            reviewerEmail,
            review,
            rating: parseInt(rating)
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error('Error submitting review:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to submit review' },
            { status: 500 }
        );
    }
}
