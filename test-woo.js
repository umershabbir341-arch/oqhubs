const fs = require('fs');

const ck = 'ck_2d4887bcb4c023beee93d0ffbd1dc8e7f77916bf';
const cs = 'cs_8efe428495180c963486a201d2d142087a592cea';
const baseUrl = 'https://oqhubs.com';
const apiEndpoint = `${baseUrl}/wp-json/wc/v3`;

async function test() {
    console.log('Starting test...');
    const url = new URL(`${apiEndpoint}/products/categories`);
    url.searchParams.append('consumer_key', ck);
    url.searchParams.append('consumer_secret', cs);
    url.searchParams.append('per_page', '100');

    console.log('Fetching:', url.toString());
    try {
        const response = await fetch(url.toString());
        console.log('Status:', response.status);
        const data = await response.json();
        fs.writeFileSync('categories.json', JSON.stringify(data, null, 2));
        console.log('Categories saved to categories.json');

        const pUrl = new URL(`${apiEndpoint}/products`);
        pUrl.searchParams.append('consumer_key', ck);
        pUrl.searchParams.append('consumer_secret', cs);
        pUrl.searchParams.append('per_page', '10');

        console.log('Fetching products...');
        const pResponse = await fetch(pUrl.toString());
        const pData = await pResponse.json();
        fs.writeFileSync('products.json', JSON.stringify(pData, null, 2));
        console.log('Products saved to products.json');

    } catch (e) {
        console.error('Error:', e);
        fs.writeFileSync('error.log', e.stack || e.message);
    }
}

test();
