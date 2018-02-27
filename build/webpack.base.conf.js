var path = require('path') // node模块
var utils = require('./utils')
var config = require('../config')  // config 的index文件
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir) // 串联并格式化路径，__dirname:当前模块所在的目录的完整绝对路径（/Users/shelley/sell-vue/build）
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,  // 输出的路径 是本地搭建环境的路径
    filename: '[name].js', // name 就是entry的key(这里是app)
    publicPath: process.env.NODE_ENV === 'production'   //也是输出路径，是之后在服务器上的路径
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: { // require es6相关的配置
    extensions: ['.js', '.vue', '.json'], // 引入文件时候可以省略后缀名
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: { // 仅仅试用于js文件引入时候缩写，stylus不可
      'vue$': 'vue/dist/vue.common.js',
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'common': resolve('src/common')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',// 用什么loader编译
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]  // 只包含哪些目录 exclude是排除哪些目录
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: { // 检查
          limit: 10000, // 边界文件大小，如果小于这个值就生成base64编码
          name: utils.assetsPath('img/[name].[hash:7].[ext]')  // 超过边界值产生的文件名
        }
      },
      {
        test: /\.(woff2?|woff|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
