import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

  const envCheck = {
    SHOPIFY_STORE_DOMAIN: domain ? `set (${domain})` : 'MISSING',
    SHOPIFY_STOREFRONT_TOKEN: token ? 'set (hidden)' : 'MISSING',
  };

  if (!domain || !token) {
    return NextResponse.json({ status: 'env vars missing', env: envCheck }, { status: 500 });
  }

  try {
    const { createStorefrontApiClient } = await import('@shopify/storefront-api-client');
    const client = createStorefrontApiClient({ storeDomain: domain, apiVersion: '2026-04', publicAccessToken: token });
    const { data, errors } = await client.request('{ shop { name } }');
    if (errors) return NextResponse.json({ status: 'shopify error', errors, env: envCheck }, { status: 500 });
    return NextResponse.json({ status: 'ok', shop: data.shop.name, env: envCheck });
  } catch (e) {
    return NextResponse.json({ status: 'exception', error: String(e), env: envCheck }, { status: 500 });
  }
}
