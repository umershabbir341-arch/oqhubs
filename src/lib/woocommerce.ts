import 'server-only';
import { Product, AttributeOption } from "@/types";

const ck = process.env.Consumer_Key;
const cs = process.env.Consumer_Secret;
const wcUrl = process.env.WC_URL;
const baseUrl = wcUrl?.startsWith('http') ? wcUrl : `https://${wcUrl}`;
const apiEndpoint = `${baseUrl}/wp-json/wc/v3`;

async function wooFetch({ endpoint, params = {}, cache = 'no-store' }: { endpoint: string, params?: any, cache?: RequestCache }) {
    const url = new URL(`${apiEndpoint}/${endpoint}`);

    // Add params to URL
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            cache,
        });

        if (!response.ok) {
            let errorMessage = 'Failed to fetch from WooCommerce';
            try {
                const error = await response.json();
                errorMessage = error.message || errorMessage;
            } catch (e) {
                errorMessage = await response.text() || errorMessage;
            }
            console.error('WooCommerce API error:', errorMessage);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (e: any) {
        console.error('Error fetching from WooCommerce:', e.message || e);
        return null;
    }
}

export function transformWooProduct(wooProduct: any): Product {
    if (!wooProduct) return null as any;

    const images = wooProduct.images?.map((img: any) => img.src) || [];

    // WooCommerce variations handling
    const sizes: string[] = [];
    const colors: string[] = [];
    const options: AttributeOption[] = [];

    if (wooProduct.attributes) {
        wooProduct.attributes.forEach((attr: any) => {
            if (attr.variation) {
                options.push({
                    name: attr.name,
                    values: attr.options
                });

                if (attr.name.toLowerCase().includes('size')) {
                    sizes.push(...attr.options);
                }
                if (attr.name.toLowerCase().includes('color')) {
                    colors.push(...attr.options);
                }
            }
        });
    }

    // Normalize variations if present
    const variants = wooProduct.variationData?.map((v: any) => {
        const selectedOptions = v.attributes?.map((attr: any) => ({
            name: attr.name,
            value: attr.option
        })) || [];

        return {
            id: v.id.toString(),
            price: {
                amount: v.price || v.regular_price || '0',
                currencyCode: 'USD'
            },
            selectedOptions: selectedOptions,
            image: v.image ? { url: v.image.src } : null
        };
    }) || [];

    return {
        id: wooProduct.slug || wooProduct.id.toString(),
        shopifyId: wooProduct.id.toString(), // Maintaining compat with existing type
        name: wooProduct.name,
        category: wooProduct.categories?.[0]?.slug || 'general',
        price: parseFloat(wooProduct.price || '0') || 0,
        originalPrice: (parseFloat(wooProduct.regular_price) > parseFloat(wooProduct.price))
            ? parseFloat(wooProduct.regular_price)
            : undefined,
        description: wooProduct.short_description?.replace(/<[^>]*>/g, '') || wooProduct.description?.replace(/<[^>]*>/g, '') || '',
        image: images[0] || '',
        gallery: images,
        sizes: sizes,
        colors: colors,
        options: options,
        variants: variants,
        reviewCount: wooProduct.rating_count || 0,
        rating: parseFloat(wooProduct.average_rating) || undefined
    };
}

export async function getAllProducts() {
    const products = await wooFetch({
        endpoint: 'products',
        params: { per_page: 50, status: 'publish' }
    });

    return products || [];
}

export async function getProductsByCategoryName(categoryName: string) {
    // Search for categories matching the name
    const categories = await wooFetch({
        endpoint: 'products/categories',
        params: { search: categoryName }
    });

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        console.log(`No category found for search: ${categoryName}`);
        return [];
    }

    // Use the first matching category
    const categoryId = categories[0].id;

    const products = await wooFetch({
        endpoint: 'products',
        params: { category: categoryId, per_page: 50, status: 'publish' }
    });

    return products || [];
}

export async function getProductByHandle(handle: string) {
    const products = await wooFetch({
        endpoint: 'products',
        params: { slug: handle, status: 'publish' }
    });

    if (!products || !Array.isArray(products) || products.length === 0) return null;

    const product = products[0];

    // If it's a variable product, fetch the full variation details
    if (product.type === 'variable' && product.variations?.length > 0) {
        const variations = await wooFetch({
            endpoint: `products/${product.id}/variations`,
            params: { per_page: 100 }
        });
        product.variationData = variations || [];
    }

    return product;
}

export async function getCollections() {
    const categories = await wooFetch({
        endpoint: 'products/categories',
        params: { hide_empty: true }
    });

    if (!categories || !Array.isArray(categories)) return [];

    return categories.map((cat: any) => ({
        id: cat.id.toString(),
        title: cat.name,
        handle: cat.slug
    }));
}

export async function getCollectionProducts(collectionHandle: string, options: {
    min_price?: string,
    max_price?: string,
    sort?: string,
    page?: number
} = {}) {
    // First get the category ID from the handle
    if (collectionHandle === 'all' || collectionHandle === 'new-arrivals') {
        const params: any = { per_page: 50, status: 'publish' };
        if (options.min_price) params.min_price = options.min_price;
        if (options.max_price) params.max_price = options.max_price;
        if (options.sort === 'price-low') { params.orderby = 'price'; params.order = 'asc'; }
        if (options.sort === 'price-high') { params.orderby = 'price'; params.order = 'desc'; }

        const products = await wooFetch({
            endpoint: 'products',
            params
        });
        return products || [];
    }

    const categories = await wooFetch({
        endpoint: 'products/categories',
        params: { slug: collectionHandle },
        cache: 'no-store'
    });

    if (!categories || !Array.isArray(categories) || categories.length === 0) return [];

    const categoryId = categories[0].id;

    const params: any = { category: categoryId, per_page: 50, status: 'publish' };
    if (options.min_price) params.min_price = options.min_price;
    if (options.max_price) params.max_price = options.max_price;
    if (options.sort === 'price-low') { params.orderby = 'price'; params.order = 'asc'; }
    if (options.sort === 'price-high') { params.orderby = 'price'; params.order = 'desc'; }

    const products = await wooFetch({
        endpoint: 'products',
        params
    });

    return products || [];
}

export async function searchProducts(query: string) {
    const products = await wooFetch({
        endpoint: 'products',
        params: { search: query, per_page: 20, status: 'publish' }
    });

    return products || [];
}

// Reviews API functions
export async function getProductReviews(productId: string) {
    const reviews = await wooFetch({
        endpoint: `products/reviews`,
        params: { product: productId, per_page: 100, status: 'approved' },
        cache: 'no-store'
    });

    if (!reviews || !Array.isArray(reviews)) return [];

    return reviews.map((review: any) => ({
        id: review.id,
        productId: review.product_id,
        reviewer: review.reviewer,
        reviewerEmail: review.reviewer_email,
        review: review.review,
        rating: review.rating,
        dateCreated: review.date_created,
        verified: review.verified
    }));
}

export async function submitProductReview(productId: string, reviewData: {
    reviewer: string;
    reviewerEmail: string;
    review: string;
    rating: number;
}) {
    const url = new URL(`${apiEndpoint}/products/reviews`);
    const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify({
                product_id: parseInt(productId),
                reviewer: reviewData.reviewer,
                reviewer_email: reviewData.reviewerEmail,
                review: reviewData.review,
                rating: reviewData.rating
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to submit review');
        }

        return await response.json();
    } catch (e: any) {
        console.error('Error submitting review:', e.message || e);
        throw e;
    }
}

export async function createOrder(orderData: {
    payment_method: string;
    payment_method_title: string;
    set_paid: boolean;
    billing: any;
    shipping: any;
    line_items: any[];
    shipping_lines: any[];
}) {
    const url = new URL(`${apiEndpoint}/orders`);
    const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create order');
        }

        return await response.json();
    } catch (e: any) {
        console.error('Error creating WooCommerce order:', e.message || e);
        throw e;
    }
}

export async function createCart(lines: { merchandiseId: string, quantity: number }[]) {
    // For WooCommerce, we redirect to checkout with add-to-cart params
    // Some setups support comma-separated IDs: /checkout/?add-to-cart=ID1,ID2
    const checkoutUrl = new URL(`${baseUrl}/checkout/`);

    if (lines.length > 0) {
        const ids = lines.map(line => line.merchandiseId).join(',');
        checkoutUrl.searchParams.append('add-to-cart', ids);
        // Note: quantity parameter usually applies to all or the first item in URL-based add-to-cart
        if (lines.length === 1) {
            checkoutUrl.searchParams.append('quantity', lines[0].quantity.toString());
        }
    }

    return {
        cart: {
            id: 'woo-cart',
            checkoutUrl: checkoutUrl.toString()
        },
        userErrors: []
    };
}

// Auth functions for WooCommerce and WordPress
export async function createCustomer(input: any): Promise<any> {
    const url = new URL(`${apiEndpoint}/customers`);
    const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify({
                email: input.email,
                first_name: input.firstName,
                last_name: input.lastName,
                password: input.password,
                username: input.email // Using email as username
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                customer: null,
                customerUserErrors: [{ message: result.message || 'Failed to create customer' }]
            };
        }

        return {
            customer: {
                id: result.id,
                email: result.email,
                firstName: result.first_name,
                lastName: result.last_name
            },
            customerUserErrors: []
        };
    } catch (e: any) {
        console.error('Error creating WooCommerce customer:', e.message || e);
        return {
            customer: null,
            customerUserErrors: [{ message: 'An unexpected error occurred during signup.' }]
        };
    }
}

export async function createAccessToken(input: any): Promise<any> {
    // Note: This requires the "JWT Authentication for WP REST API" plugin
    const url = `${baseUrl}/wp-json/jwt-auth/v1/token`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: input.email,
                password: input.password
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                customerAccessToken: null,
                customerUserErrors: [{ message: result.message || 'Invalid email or password' }]
            };
        }

        return {
            customerAccessToken: {
                accessToken: result.token,
                expiresAt: null // JWT handles its own expiration
            },
            customerUserErrors: []
        };
    } catch (e: any) {
        console.error('Error creating WordPress access token:', e.message || e);
        return {
            customerAccessToken: null,
            customerUserErrors: [{ message: 'An unexpected error occurred during login.' }]
        };
    }
}

export async function getCustomer(accessToken: string): Promise<any> {
    const wpUrl = `${baseUrl}/wp-json/wp/v2/users/me`;

    try {
        const wpResponse = await fetch(wpUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const wpUser = await wpResponse.json();

        if (!wpResponse.ok) {
            console.error('Error fetching WordPress user:', wpUser.message);
            return null;
        }

        // Now fetch full WooCommerce customer data using email
        const wcUrl = new URL(`${apiEndpoint}/customers`);
        wcUrl.searchParams.append('email', wpUser.email);
        const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

        const wcResponse = await fetch(wcUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            }
        });

        const wcCustomers = await wcResponse.json();

        if (!wcResponse.ok || !Array.isArray(wcCustomers) || wcCustomers.length === 0) {
            // Fallback to WP user data if WC customer not found
            return {
                id: wpUser.id,
                email: wpUser.email,
                firstName: wpUser.name?.split(' ')[0] || '',
                lastName: wpUser.name?.split(' ')[1] || '',
                displayName: wpUser.name
            };
        }

        const customer = wcCustomers[0];

        return {
            id: customer.id,
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            displayName: `${customer.first_name} ${customer.last_name}`.trim(),
            phone: customer.billing?.phone || '',
            billing: customer.billing,
            shipping: customer.shipping,
            avatarUrl: customer.avatar_url
        };
    } catch (e: any) {
        console.error('Error in getCustomer:', e.message || e);
        return null;
    }
}

export async function getCustomerOrders(accessToken: string): Promise<any> {
    const customer = await getCustomer(accessToken);
    if (!customer) return [];

    const url = new URL(`${apiEndpoint}/orders`);
    url.searchParams.append('customer', customer.id.toString());
    const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            }
        });

        const orders = await response.json();

        if (!response.ok) {
            console.error('Error fetching WooCommerce orders:', orders.message);
            return [];
        }

        return orders;
    } catch (e: any) {
        console.error('Error in getCustomerOrders:', e.message || e);
        return [];
    }
}

export async function updateCustomer(accessToken: string, input: any): Promise<any> {
    // First get the user ID using the token
    const userMe = await getCustomer(accessToken);
    if (!userMe) {
        return { customer: null, customerUserErrors: [{ message: 'Unauthorized' }] };
    }

    const url = `${baseUrl}/wp-json/wp/v2/users/${userMe.id}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                first_name: input.firstName,
                last_name: input.lastName,
                name: `${input.firstName} ${input.lastName}`.trim()
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                customer: null,
                customerUserErrors: [{ message: result.message || 'Failed to update profile' }]
            };
        }

        return {
            customer: {
                id: result.id,
                email: result.email,
                firstName: result.first_name,
                lastName: result.last_name
            },
            customerUserErrors: []
        };
    } catch (e: any) {
        console.error('Error updating WordPress user:', e.message || e);
        return {
            customer: null,
            customerUserErrors: [{ message: 'An unexpected error occurred.' }]
        };
    }
}
export async function getShopData() {
    try {
        const settings = await wooFetch({
            endpoint: 'settings/general',
            cache: 'no-store'
        });

        // Find the currency setting in the array
        const currencySetting = settings && Array.isArray(settings)
            ? settings.find((s: any) => s.id === 'woocommerce_currency')
            : null;

        return {
            name: 'OQHubs',
            paymentSettings: {
                currencyCode: currencySetting?.value || 'USD'
            }
        };
    } catch (error) {
        console.error('Error fetching shop data:', error);
        return {
            name: 'OQHubs',
            paymentSettings: {
                currencyCode: 'USD'
            }
        };
    }
}
