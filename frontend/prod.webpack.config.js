/*
 * Webpack production build configuration
 *
 */
'use strict';

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var buildDate = new Date();

var envOpts = {
  publicPath: '/quirx/assets/',
  API_URL: 'http://quirx.herokuapp.com'
};

if (process.env.CI) {
  envOpts = {
    publicPath: '/assets/',
    API_URL: 'http://localhost:9292'
  };
}


module.exports = {
  output: {
    path: path.join(__dirname, 'build', 'assets'),
    publicPath:  envOpts.publicPath,
    filename: "[name]-[hash].js",
    chunkFilename: "[id].chunk.[hash].js",
    pathinfo: true
  },

  cache: true,
  debug: false,
  devtool: false,
  entry: {
    main: [
      './src/index.jsx'
    ]
  },

  resolve: {
    root: path.join(__dirname, 'src'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },

  resolveLoader: { root: path.join(__dirname, "node_modules") },

  externals: {},

  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader?stage=0&optional=runtime'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader')
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.(ttf|eot)$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.json5$/,
        loader: 'json5-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({
      title: 'Qui℞',
      description: 'Qui℞ helps to find spikes in FDA anomaly queries.',
      template: './templates/prod/index.html',
      filename: '../index.html',
      buildDate: {
        unix: buildDate.getTime(),
        string: buildDate.toString(),
        date: buildDate.toDateString()
      },
      inject: false
    }),
    new ExtractTextPlugin("[name]-[hash].css", {allChucks: true}),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify('production')
      },
      DEBUG: false,
      BROWSER: true,
      API_URL: JSON.stringify(envOpts.API_URL)
    })
  ],

  eslint: {
    configFile: './.eslintrc'
  }
};
