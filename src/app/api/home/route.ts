import { NextResponse } from 'next/server';
import {
  getAllProducts,
  getProductsByCategoryName,
  transformWooProduct,
} from '@/lib/woocommerce';

export async function GET() {
  try {
    // Primary hero products: "Headphones & Neckband" with fallback to all products
    const headphonesWoo = await getProductsByCategoryName('Headphones & Neckband');
    const baseWooProducts =
      headphonesWoo && headphonesWoo.length > 0 ? headphonesWoo : await getAllProducts();
    const products = baseWooProducts.map(transformWooProduct);

    // Tabbed section products
    const watchesWoo = await getProductsByCategoryName('Watches');
    const earbudsWoo = await getProductsByCategoryName('Earbuds');

    const watchesProducts = (watchesWoo || []).map(transformWooProduct);
    const earbudsProducts = (earbudsWoo || []).map(transformWooProduct);

    return NextResponse.json({
      products,
      watchesProducts,
      earbudsProducts,
    });
  } catch (error) {
    console.error('Home API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

