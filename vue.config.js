'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: false,
  devServer: {
    host: '0.0.0.0',
    port:"80",
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://10.10.112.211:8086`, // 86线上正式！！！MOS
        // target: `http://192.168.137.103:9001`, // 86线上正式！！！MOS
        target: `http://10.81.131.243:9001`, // 9001合价地址
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      },
    },
    disableHostCheck: true
  },
  configureWebpack:{
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
  },
}
