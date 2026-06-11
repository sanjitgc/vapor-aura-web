import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const storefrontClient = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2026-04',
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN!,
});

async function getAdminAccessToken(): Promise<string> {
  const response = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    }
  );
  const data = await response.json();
  console.log(data);
  return data.access_token;
}

async function adminRequest(query: string, variables?: object) {
  const token = await getAdminAccessToken();
  const response = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2026-04/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data;
}

export async function getProducts() {
  const { data, errors } = await storefrontClient.request(`
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            descriptionHtml
            handle
            tags
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `);
  if (errors) throw new Error('Failed to fetch products');
  return data.products.edges.map((edge: any) => edge.node);
}

export async function getProductByHandle(handle: string) {
  const { data, errors } = await storefrontClient.request(`
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        descriptionHtml
        handle
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
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
    }
  `, { variables: { handle } });
  if (errors) throw new Error('Failed to fetch product');
  return data.productByHandle;
}
export async function getAdminProducts() {
  const data = await adminRequest(`
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            descriptionHtml
            handle
            status
            tags
            images(first: 1) {
            edges{
            node{
            url
            altText
            }
            }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price
                }
              }
            }
          }
        }
      }
    }
  `);
  return data.products.edges.map((edge: any) => edge.node);
}

export async function createShopifyProduct(payload: {
  title: string;
  descriptionHtml: string;
  tags: string[];
  price: string;
  sku: string;
  inStock: boolean;
  imageUrl?:string;
}) {
  const data = await adminRequest(`
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    input: {
      title: payload.title,
      descriptionHtml: payload.descriptionHtml,
      tags: payload.tags,
      status: 'ACTIVE'
      }
  });

  if (data?.productCreate?.userErrors?.length > 0) {
    throw new Error(data.productCreate.userErrors[0].message);
  }

  const product = data.productCreate.product;
  const variantId = product.variants.edges[0]?.node?.id;

  if (variantId) {
    await adminRequest(`
      mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants {
            id
            price
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      productId: product.id,
      variants: [{
        id: variantId,
        price: payload.price,
      }]
    });
  }
  if (payload.imageUrl) {
    await adminRequest(`
      mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
        productCreateMedia(productId: $productId, media: $media) {
          media {
            ... on MediaImage {
              id
              image {
                url
              }
            }
          }
          mediaUserErrors {
            field
            message
          }
        }
      }
    `, {
      productId: product.id,
      media: [{
        originalSource: payload.imageUrl,
        mediaContentType: "IMAGE",
      }]
    });
  }
  await adminRequest(`
    mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        publishable {
          availablePublicationsCount {
            count
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    id: product.id,
    input: [{
      publicationId: process.env.SHOPIFY_PUBLICATION_ID!,
    }]
  });
  return product;
}

export async function updateShopifyProduct(id: string, payload: {
  title?: string;
  descriptionHtml?: string;
  tags?: string[];
  price?: string;
  imageUrl?: string;
}) {
  const data = await adminRequest(`
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    input: {
      id,
      title: payload.title,
      descriptionHtml: payload.descriptionHtml,
      tags: payload.tags,
    }
  });

  if (data?.productUpdate?.userErrors?.length > 0) {
    throw new Error(data.productUpdate.userErrors[0].message);
  }

  const product = data.productUpdate.product;
  const variantId = product.variants.edges[0]?.node?.id;

  if (variantId && payload.price) {
    await adminRequest(`
      mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants {
            id
            price
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      productId: product.id,
      variants: [{
        id: variantId,
        price: payload.price,
      }]
    });
  }

if (payload.imageUrl) {

  const mediaData = await adminRequest(`
    query {
      product(id: "${product.id}") {
        media(first: 10) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `);

  const existingMediaIds = mediaData?.product?.media?.edges?.map(
    (edge: any) => edge.node.id
  ) ?? [];

  if (existingMediaIds.length > 0) {
    await adminRequest(`
      mutation productDeleteMedia($productId: ID!, $mediaIds: [ID!]!) {
        productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
          deletedMediaIds
          mediaUserErrors {
            field
            message
          }
        }
      }
    `, {
      productId: product.id,
      mediaIds: existingMediaIds,
    });
  }

  await adminRequest(`
    mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media {
          ... on MediaImage {
            id
            image {
              url
            }
          }
        }
        mediaUserErrors {
          field
          message
        }
      }
    }
  `, {
    productId: product.id,
    media: [{
      originalSource: payload.imageUrl,
      mediaContentType: "IMAGE",
    }]
  });
}

  return product;
}

export async function deleteShopifyProduct(id: string) {
  const data = await adminRequest(`
    mutation productDelete($input: ProductDeleteInput!) {
      productDelete(input: $input) {
        deletedProductId
        userErrors {
          field
          message
        }
      }
    }
  `, {
    input: { id }
  });

  if (data?.productDelete?.userErrors?.length > 0) {
    throw new Error(data.productDelete.userErrors[0].message);
  }

  return data.productDelete.deletedProductId;
}
export async function uploadImageToShopify(file: File): Promise<string> {
  const stagedData = await adminRequest(`
    mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    input: [{
      filename: file.name,
      mimeType: file.type,
      resource: "IMAGE",
      httpMethod: "POST"
    }]
  });

  if (stagedData?.stagedUploadsCreate?.userErrors?.length > 0) {
    throw new Error(stagedData.stagedUploadsCreate.userErrors[0].message);
  }

  const target = stagedData.stagedUploadsCreate.stagedTargets[0];
  const { url, parameters, resourceUrl } = target;

  const formData = new FormData();

  parameters.forEach(({ name, value }: { name: string; value: string }) => {
    formData.append(name, value);
  });

  formData.append("file", file, file.name);

  const uploadResponse = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image to Shopify staged storage");
  }

  const fileCreateRes = await adminRequest(`
    mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          id
          fileStatus
          ... on MediaImage {
            image {
              url
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    files: [
      {
        originalSource: resourceUrl,
        contentType: "IMAGE"
      }
    ]
  });

  if (fileCreateRes?.fileCreate?.userErrors?.length > 0) {
    throw new Error(fileCreateRes.fileCreate.userErrors[0].message);
  }

  const fileData = fileCreateRes.fileCreate.files[0];

  const finalUrl =
    fileData?.image?.url || resourceUrl;

  return finalUrl;
}
export async function getAdminProductByHandle(handle: string) {
  const data = await adminRequest(`
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        status
        descriptionHtml
        tags
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
              availableForSale
            }
          }
        }
      }
    }
  `, { handle });

  return data.productByHandle;
}
export async function createCart(items: {
  variantId: string;
  quantity: number;
}[]) {
  const { data, errors } = await storefrontClient.request(`
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: {
      input: {
        lines: items.map(item => ({
          merchandiseId: item.variantId,
          quantity: item.quantity,
        }))
      }
    }
  });

  if (errors) throw new Error('Failed to create cart');
  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, items: {
  variantId: string;
  quantity: number;
}[]) {
  const { data, errors } = await storefrontClient.request(`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: {
      cartId,
      lines: items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      }))
    }
  });

  if (errors) throw new Error('Failed to add to cart');
  return data.cartLinesAdd.cart;
}

export async function getCart(cartId: string) {
  const { data, errors } = await storefrontClient.request(`
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `, {
    variables: { cartId }
  });

  if (errors) throw new Error('Failed to get cart');
  return data.cart;
}