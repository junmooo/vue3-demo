const { defineConfig } = require("@vue/cli-service");
const AutoImport = require("unplugin-auto-import/webpack");
const components = require("unplugin-vue-components/webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin(),
      AutoImport({ resolvers: [ElementPlusResolver()] }), // 按需引入element-plus组件
      components({ resolvers: [ElementPlusResolver()] }), // 按需引入element-plus组件
      new CompressionPlugin({ test: /\.js$|\.html$|\.css/, threshold: 10240 }), // 压缩
    ],
  },

  outputDir: "./dist/",
  assetsDir: "ai",

  devServer: {
    allowedHosts: "all",
    port: 8088,
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: []
    }
  }
});
