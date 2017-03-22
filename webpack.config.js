const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

function getPlugins() {
  var plugins = [
    // new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin({
      filename: `[name]${!isProd ? '' : '.min'}.css`,
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': process.env.NODE_ENV || 'development'
      }
    })
  ];

  if (isProd) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
  }

  return plugins;
}


module.exports = {
  devtool: !isProd ? 'source-map' : false,

  entry: {
    'nutrition-label': './src/nutrition-label.js'
  },

  output: {
    filename: `[name]${!isProd ? '' : '.min'}.js`,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        plugins: ['transform-runtime']
      }
    },{
      test:/\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: false,
            minimize: isProd
          }
        },{
          loader: 'sass-loader',
          options: {
            sourceMap: false,
            minimize: isProd
          }
        }]
      })
    }]
  },

  plugins: getPlugins()
}
