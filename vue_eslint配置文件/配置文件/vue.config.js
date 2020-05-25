module.exports = {
  devServer: {
    // open: true,
    // host: '127.0.0.1',
    // post: 9999,
    // https: false,
    // hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000', // 本地服务器1地址
        // target: 'https://api.leijiuling.com', // 线上真实地址
        ws: true,
        changeOrigin: true, // 是否开启跨域
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
