const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = require('./config');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    entry: `${config.DEMO}/index.js`,
  },
  resolve: {
    alias: {
      src: config.SRC,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: config.BABEL,
        },
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
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
  ],
};
