import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export type ProductListItem = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  } | null;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
};

export type ProductVariant = {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
  availableForSale: boolean;
};

export type ProductSpecs = {
  dimensions: string | null;
  material: string | null;
  weight: string | null;
  origin: string | null;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  images: { url: string; altText: string | null }[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: ProductVariant[];
  specs: ProductSpecs;
};

export type CollectionListItem = {
  id: string;
  title: string;
  handle: string;
};

export type Collection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  products: ProductListItem[];
};

function getClient() {
  return createStorefrontApiClient({
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
    apiVersion: '2026-04',
    publicAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN!,
  });
}

export async function getProducts(): Promise<ProductListItem[]> {
  const client = getClient();
  const { data, errors } = await client.request(`
    {
      products(first: 50) {
        nodes {
          id
          title
          handle
          vendor
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
        }
      }
    }
  `);

  if (errors) throw new Error(errors.message);
  return data.products.nodes;
}

export async function getProduct(handle: string): Promise<Product | null> {
  const client = getClient();
  const { data, errors } = await client.request(
    `
    query Product($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        vendor
        description
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          nodes {
            url
            altText
          }
        }
        variants(first: 20) {
          nodes {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
          }
        }
        metafields(identifiers: [
          { namespace: "custom", key: "dimensions" },
          { namespace: "custom", key: "material" },
          { namespace: "custom", key: "weight" },
          { namespace: "custom", key: "origin" }
        ]) {
          key
          value
        }
      }
    }
  `,
    { variables: { handle } }
  );

  if (errors) throw new Error(errors.message);
  if (!data.product) return null;

  const metafields: { key: string; value: string }[] = data.product.metafields?.filter(Boolean) ?? [];
  const getMeta = (key: string) => metafields.find((m) => m.key === key)?.value ?? null;

  return {
    ...data.product,
    images: data.product.images.nodes,
    variants: data.product.variants.nodes,
    specs: {
      dimensions: getMeta('dimensions'),
      material: getMeta('material'),
      weight: getMeta('weight'),
      origin: getMeta('origin'),
    },
  };
}

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      handle: string;
      featuredImage: { url: string; altText: string | null } | null;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  lines: CartLine[];
  totalAmount: { amount: string; currencyCode: string };
};

const CART_FIELDS = `
  id
  checkoutUrl
  lines(first: 100) {
    nodes {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          title
          price { amount currencyCode }
          product {
            title
            handle
            featuredImage { url altText }
          }
        }
      }
    }
  }
  cost {
    totalAmount { amount currencyCode }
  }
`;

function parseCart(cart: Record<string, unknown>): Cart {
  const lines = cart.lines as { nodes: CartLine[] };
  const cost = cart.cost as { totalAmount: { amount: string; currencyCode: string } };
  return {
    id: cart.id as string,
    checkoutUrl: cart.checkoutUrl as string,
    lines: lines.nodes,
    totalAmount: cost.totalAmount,
  };
}

export async function createCart(merchandiseId: string, quantity: number): Promise<Cart> {
  const client = getClient();
  const { data, errors } = await client.request(
    `
    mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { ${CART_FIELDS} }
      }
    }
  `,
    { variables: { lines: [{ merchandiseId, quantity }] } }
  );
  if (errors) throw new Error(errors.message);
  return parseCart(data.cartCreate.cart);
}

export async function addCartLine(cartId: string, merchandiseId: string, quantity: number): Promise<Cart> {
  const client = getClient();
  const { data, errors } = await client.request(
    `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
      }
    }
  `,
    { variables: { cartId, lines: [{ merchandiseId, quantity }] } }
  );
  if (errors) throw new Error(errors.message);
  return parseCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const client = getClient();
  const { data, errors } = await client.request(
    `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
      }
    }
  `,
    { variables: { cartId, lines: [{ id: lineId, quantity }] } }
  );
  if (errors) throw new Error(errors.message);
  return parseCart(data.cartLinesUpdate.cart);
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  const client = getClient();
  const { data, errors } = await client.request(
    `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
      }
    }
  `,
    { variables: { cartId, lineIds: [lineId] } }
  );
  if (errors) throw new Error(errors.message);
  return parseCart(data.cartLinesRemove.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const client = getClient();
  const { data, errors } = await client.request(
    `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FIELDS} }
    }
  `,
    { variables: { cartId } }
  );
  if (errors) throw new Error(errors.message);
  if (!data.cart) return null;
  return parseCart(data.cart);
}

export async function getCollections(): Promise<CollectionListItem[]> {
  try {
    const client = getClient();
    const { data, errors } = await client.request(`
      {
        collections(first: 20) {
          nodes {
            id
            title
            handle
          }
        }
      }
    `);
    if (errors) return [];
    return data.collections.nodes;
  } catch {
    return [];
  }
}

export async function getCollection(handle: string): Promise<Collection | null> {
  const client = getClient();
  const { data, errors } = await client.request(
    `
    query Collection($handle: String!) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        products(first: 50) {
          nodes {
            id
            title
            handle
            vendor
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount currencyCode }
            }
            featuredImage { url altText }
          }
        }
      }
    }
  `,
    { variables: { handle } }
  );
  if (errors) throw new Error(errors.message);
  if (!data.collection) return null;
  return {
    ...data.collection,
    products: data.collection.products.nodes,
  };
}

export type ShopPolicy = {
  title: string;
  body: string;
  handle: string;
};

export async function getPolicy(handle: string): Promise<ShopPolicy | null> {
  const client = getClient();
  const { data, errors } = await client.request(`
    {
      shop {
        privacyPolicy { title body handle }
        termsOfService { title body handle }
        refundPolicy { title body handle }
        shippingPolicy { title body handle }
      }
    }
  `);
  if (errors) return null;
  const { shop } = data;
  const all: (ShopPolicy | null)[] = [
    shop.privacyPolicy,
    shop.termsOfService,
    shop.refundPolicy,
    shop.shippingPolicy,
  ];
  return all.filter(Boolean).find((p) => p!.handle === handle) ?? null;
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
