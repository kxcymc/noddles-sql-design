const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require('webpack')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const config = {
  cache: false,  // 禁用缓存
  // mode: 'development',
  // 入口
  entry: {
    'intro': path.resolve(__dirname, 'src/intro/index.js'),
    'order': path.resolve(__dirname, 'src/order/index.js'),
    'manage': path.resolve(__dirname, 'src/manage/index.js')
  },
  // 出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './[name]/index.js',
    clean: true // 生成打包后内容之前，清空输出目录
  },
  devServer: {
    port: process.env.PORT || 8080,
    static: path.join(__dirname, 'src')
  },
  // 插件（给 Webpack 提供更多功能）
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/intro.html'), // 模板文件
      filename: path.resolve(__dirname, 'dist/intro/index.html'), // 输出文件
      useCdn: process.env.NODE_ENV === 'production', // 生产模式下使用 cdn 引入的地址
      chunks: ['intro'] // 引入哪些打包后的模块（和 entry 的 key 一致）
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/order.html'), // 模板文件
      filename: path.resolve(__dirname, 'dist/order/index.html'), // 输出文件
      useCdn: process.env.NODE_ENV === 'production', // 生产模式下使用 cdn 引入的地址
      chunks: ['order']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/manage.html'), // 模板文件
      filename: path.resolve(__dirname, 'dist/manage/index.html'), // 输出文件
      useCdn: process.env.NODE_ENV === 'production', // 生产模式下使用 cdn 引入的地址
      chunks: ['manage']
    }),
    new MiniCssExtractPlugin({
      filename: './[name]/index.css'
    }), // 生成 css 文件
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new NodePolyfillPlugin()
  ],
  // 加载器（让 webpack 识别更多模块文件内容）
  module: {
    rules: [
        {
            test: /\.(scss)$/i,
            use: [
              {
                loader: process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader
              },
              {
                loader: 'css-loader'
              },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: () => [
                      require('autoprefixer')
                    ]
                  }
                }
              },
              {
                loader: 'sass-loader'
              }
            ]
        }, 
      {
        test: /\.css$/i,
        use: [
          {
            loader: process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          'css-loader', 
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[hash][ext][query]'
        }
      }
    ],
  },
  // 优化
  optimization: {
    // 最小化
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释（保证 js 代码还能压缩）
      `...`,
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all', // 所有模块动态非动态移入的都分割分析
      cacheGroups: { // 分隔组
        commons: { // 抽取公共模块
          minSize: 0, // 抽取的chunk最小大小字节
          minChunks: 2, // 最小引用数
          reuseExistingChunk: true, // 当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用
          name(module, chunks, cacheGroupKey) { // 分离出模块文件名
            const allChunksNames = chunks.map((item) => item.name).join('~') // 模块名1~模块名2
            return `./js/${allChunksNames}` // 输出到 dist 目录下位置
          }
        }
      }
    }
  },
  // 解析
  resolve: {
    // 别名
    alias: {
      'a_src': path.resolve(__dirname, 'src')
    },
    modules: [path.resolve(__dirname, 'node_modules')]
  },
  
}


// 开发环境下使用 sourcemap 选项
if (process.env.NODE_ENV === 'development') {
  config.devtool = 'inline-source-map'
} 

// cdn配置后面再做

// 生产环境下使用相关配置
// if (process.env.NODE_ENV === 'production') {
//   // 外部扩展（让 webpack 防止 import 的包被打包进来）
//   config.externals = {
//     // key：import from 语句后面的字符串
//     // value：留在原地的全局变量（最好和 cdn 在全局暴露的变量一致）
//     'bootstrap/dist/css/bootstrap.min.css': 'bootstrap',
//     'axios': 'axios',
//     'form-serialize': 'serialize',
//     '@wangeditor/editor': 'wangEditor'
//   }
// }


//  如下，已经使用 build.sh 完成
// 打包到生产环境后，先把public中的 index.html 放在dist文件夹中
// 终端进入dist目录，运行
// export $(cat ../.env | xargs) && http-server -p $PORT --cors="http://localhost:$PORT"
// 即可正确与后端交互

module.exports = config