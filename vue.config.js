const { defineConfig } = require("@vue/cli-service");
const AutoImport = require("unplugin-auto-import/webpack");
const components = require("unplugin-vue-components/webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  // 是否将第三方依赖库翻译成 JS。如果设置为 true，将会编译所有依赖库，可能导致打包体积增大
  transpileDependencies: true,

  configureWebpack: {
    // optimization: {
    //   splitChunks: {
    //     chunks: "all", // 分割所有 chunks
    //     // minSize: 10240, // 分割的最小大小
    //     maxSize: 10240, // 分割的最大大小
    //     // minChunks: 1, // 最小 chunk
    //     // maxAsyncRequests: 5, // 最大异步请求数量
    //     // maxInitialRequests: 3, // 最大初始化请求数量
    //     // automaticNameDelimiter: "~", // 自动命名分隔符
    //     // name: true, // 要不要使用默认的名称
    //   },
    // },
    plugins: [
      new NodePolyfillPlugin(), // 添加 Node.js 兼容的 polyfill
      AutoImport({ resolvers: [ElementPlusResolver()] }), // 按需引入 element-plus 组件
      components({ resolvers: [ElementPlusResolver()] }), // 按需引入 element-plus 组件
      new CompressionPlugin({ test: /\.js$|\.html$|\.css/, threshold: 10240 }), // 压缩
    ],
  },

  outputDir: "./dist/",
  assetsDir: "ai",

  devServer: {
    allowedHosts: "all", // 允许所有的主机访问开发服务器
    port: 8088, // 开发服务器的端口
  },

  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [],
    },
  },
});
