const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api/v3/simple/price',
        createProxyMiddleware({
            target: 'https://api.coingecko.com',
            changeOrigin: true,
        })
    );
};
