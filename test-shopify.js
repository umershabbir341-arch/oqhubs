
const domain = 'mquerko.myshopify.com';
const token = '049f54484382d230976c00823998ffb6';

async function testFetch() {
    const endpoint = `https://${domain}/api/2024-01/graphql.json`;
    const query = `
    query getProducts {
      products(first: 5) {
        edges {
          node {
            id
            handle
            title
          }
        }
      }
    }
  `;

    try {
        const result = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify({ query }),
        });

        const body = await result.json();
        console.log('Shopify API Response:', JSON.stringify(body, null, 2));
    } catch (e) {
        console.error('Shopify API Error:', e);
    }
}

testFetch();
