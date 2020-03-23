const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
    filename: 'phaser3-game-object-engine-[name].js',
    path: config.DIST,
    library: 'phaser3-game-object-engine',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000,
  },
  optimization: {
    usedExports: true,
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
          options: config.BABEL,
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        include: [config.ASSETS],
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new CopyPlugin([
      {
        from: config.ASSETS,
        to: config.ASSETS_FOLDER_NAME,
        ignore: ['demo/*.png'],
      },
    ]),
  ],
});
