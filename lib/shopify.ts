import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export type ProductListItem = {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
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
  availableForSale: boolean;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
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
          priceRange {
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
            availableForSale
          }
        }
      }
    }
  `,
    { variables: { handle } }
  );

  if (errors) throw new Error(errors.message);
  if (!data.product) return null;

  return {
    ...data.product,
    images: data.product.images.nodes,
    variants: data.product.variants.nodes,
  };
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
