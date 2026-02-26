export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import {
  getCollectionProducts,
  getCollections,
  transformWooProduct,
} from '@/lib/woocommerce';
import type { Product } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const collectionFromQuery = searchParams.get('collection') || 'all';
    const sort = searchParams.get('sort') || undefined;
    const price = searchParams.get('price') || undefined;
    const size = searchParams.get('size') || undefined;
    const color = searchParams.get('color') || undefined;

    let min_price: string | undefined;
    let max_price: string | undefined;

    if (price) {
      if (price.includes('+')) {
        min_price = price.replace(/[^0-9]/g, '');
      } else {
        const numbers = price.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
          min_price = numbers[0];
          max_price = numbers[1];
        }
      }
    }

    const wooProducts = await getCollectionProducts(collectionFromQuery, {
      sort,
      min_price,
      max_price,
    });

    let products: Product[] = (wooProducts || []).map(transformWooProduct);

    if (size) {
      products = products.filter((p: Product) => p.sizes?.includes(size));
    }

    if (color) {
      products = products.filter((p: Product) => p.colors?.includes(color));
    }

    const collections = await getCollections();

    return NextResponse.json({
      products,
      collections,
    });
  } catch (error) {
    console.error('Collections products API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

