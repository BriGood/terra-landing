import { NextRequest, NextResponse } from 'next/server';
import { getCart, createCart, addCartLine, updateCartLine, removeCartLine } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const cartId = req.nextUrl.searchParams.get('cartId');
  if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 });
  try {
    const cart = await getCart(cartId);
    return NextResponse.json({ cart });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, cartId, merchandiseId, quantity, lineId } = body;

  try {
    let cart;
    if (action === 'create') {
      cart = await createCart(merchandiseId, quantity);
    } else if (action === 'add') {
      cart = await addCartLine(cartId, merchandiseId, quantity);
    } else if (action === 'update') {
      cart = await updateCartLine(cartId, lineId, quantity);
    } else if (action === 'remove') {
      cart = await removeCartLine(cartId, lineId);
    } else {
      return NextResponse.json({ error: 'invalid action' }, { status: 400 });
    }
    return NextResponse.json({ cart });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
