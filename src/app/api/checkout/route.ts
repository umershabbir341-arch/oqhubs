import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/woocommerce';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderData } = body;

        if (!orderData) {
            return NextResponse.json({ error: 'Missing order data' }, { status: 400 });
        }

        // Add some defaults if missing
        const finalOrderData = {
            payment_method: 'cod', // Default to COD for custom flow unless specified
            payment_method_title: 'Cash on Delivery',
            set_paid: false,
            status: 'processing',
            ...orderData
        };

        const result = await createOrder(finalOrderData);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Checkout API error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error.message
        }, { status: 500 });
    }
}
