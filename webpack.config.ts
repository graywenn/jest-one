import { resolve } from 'path';
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './server/index.ts',
  output: {
    filename: 'server.js',
    path: resolve(__dirname, 'dist'),
  },
  target: 'node',
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    new CopyWebpackPlugin({
      patterns: [{ from: './server/jestManager/scripts', to: './scripts' }],
    }),
  ],
};
