var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    "./clientside/index.jsx"
  ],
  output: {
    path: __dirname + '/output',
    publicPath: "/output/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015']
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
