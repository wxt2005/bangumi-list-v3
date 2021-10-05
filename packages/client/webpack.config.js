const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
const outputPath = path.resolve(__dirname, 'dist');

const config = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : undefined,
  entry: ['./src/index.tsx'],
  output: {
    publicPath: '/',
    path: outputPath,
    filename: isDev ? 'bundle.js' : '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: isDev
                  ? '[path][name]__[local]'
                  : '[hash:base64]',
              },
            },
          },
          'postcss-loader',
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    removeDimensions: true,
                  },
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: './dist',
    },
    proxy: {
      '/api': 'http://localhost:3000',
    },
    historyApiFallback: true,
  },
  plugins: [
    isDev && new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    process.env.GA_ID &&
      new HtmlWebpackPartialsPlugin({
        path: './src/partials/analytics.html',
        location: 'head',
        priority: 'high',
        options: {
          ga_property_id: process.env.GA_ID,
        },
      }),
    new MiniCssExtractPlugin(),
    new CssMinimizerPlugin(),
    new CleanWebpackPlugin(),
    new webpack.WatchIgnorePlugin({
      paths: [/\.js$/, /\.d\.ts$/],
    }),
    new CopyPlugin({
      patterns: [{ from: './src/public', to: 'public' }],
    }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

module.exports = config;
