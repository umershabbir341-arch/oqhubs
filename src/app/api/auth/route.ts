import { NextResponse } from 'next/server';
import {
    createCustomer,
    createAccessToken,
    getCustomer,
    getCustomerOrders,
    updateCustomer
} from '@/lib/woocommerce';

export async function POST(request: Request) {
    const { action, ...data } = await request.json();

    try {
        switch (action) {
            case 'login':
                const loginResult = await createAccessToken(data);
                return NextResponse.json(loginResult);
            case 'signup':
                const signupResult = await createCustomer(data);
                return NextResponse.json(signupResult);
            case 'updateProfile':
                const { token, input } = data;
                const updateResult = await updateCustomer(token, input);
                return NextResponse.json(updateResult);
            case 'getCustomer':
                const customer = await getCustomer(data.token);
                return NextResponse.json(customer);
            case 'getOrders':
                const orders = await getCustomerOrders(data.token);
                return NextResponse.json(orders);
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error(`Auth API error (${action}):`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
