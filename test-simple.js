const https = require('https');

const url = 'https://oqhubs.com/wp-json/wc/v3/products/categories?consumer_key=ck_2d4887bcb4c023beee93d0ffbd1dc8e7f77916bf&consumer_secret=cs_8efe428495180c963486a201d2d142087a592cea';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Result:', data.substring(0, 500));
        require('fs').writeFileSync('cats_simple.json', data);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
