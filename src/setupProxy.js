
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/v1', // Если ваш запрос начинается с "/v1", он будет перенаправлен на CryptoCompare API
        createProxyMiddleware({
            target: 'https://min-api.cryptocompare.com',
            changeOrigin: true,
        })
    );
    app.use(
        '/newsapi',
        createProxyMiddleware({
          target: 'https://newsapi.org',
          changeOrigin: true,
          pathRewrite: { '^/newsapi': '' }, // Optional: rewrite path
        })
      );
};