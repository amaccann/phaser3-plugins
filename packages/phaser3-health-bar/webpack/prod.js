const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const base = require('./base');
const config = require('./config');

module.exports = Object.assign(base, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    plugin: `${config.SRC}/index.exports.js`,
  },
  externals: ['phaser'],
  output: {
    filename: 'phaser3-drag-select-[name].js',
    path: config.DIST,
    library: 'phaser3-drag-select',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
  ],
});
