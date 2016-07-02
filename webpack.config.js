var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    "./clientside/index.js"
  ],
  output: {
    path: __dirname + '/output',
    publicPath: "/output/",
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      // For Mapbox-GL-JS
      'webworkify': 'webworkify-webpack'
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },

      // Loaders for Mapbox-GL-JS
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        include: path.resolve('node_modules/mapbox-gl-shaders/index.js'),
        loader: 'transform/cacheable?brfs'
      }
    ],
    postLoaders: [{
      include: /node_modules\/mapbox-gl-shaders/,
      loader: 'transform',
      query: 'brfs'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
