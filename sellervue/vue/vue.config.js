module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    proxy: {
        '/db': {
            // target: 'http://sellerapp:8000',
            target: 'http://localhost:8000',
            changeOrigin: true,
            withCredentials:true,
            pathRewrite: {
                '^/db': ''
            }
        },
        '/C3': {
            target: 'http://localhost:8001',
            changeOrigin: true,
            withCredentials:true,
            pathRewrite: {
                '^/C3': ''
            }
        },
    }
  }
}
