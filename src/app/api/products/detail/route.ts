export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import {
  getProductByHandle,
  getAllProducts,
  transformWooProduct,
} from '@/lib/woocommerce';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');

    if (!handle) {
      return NextResponse.json(
        { error: 'Missing product handle' },
        { status: 400 },
      );
    }

    const wooProduct = await getProductByHandle(handle);

    if (!wooProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 },
      );
    }

    const product = transformWooProduct(wooProduct);

    const allWooProducts = await getAllProducts();
    const relatedProducts = (allWooProducts || [])
      .map(transformWooProduct)
      .filter((p: any) => p.id !== product.id)
      .slice(0, 6);

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

