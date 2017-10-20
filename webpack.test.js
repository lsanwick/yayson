const path = require('path')

module.exports = {
  entry: './test/browser.js',
  output: {
    path: path.resolve(__dirname, 'test-build'),
    filename: 'browser.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'test'),
    compress: true,
    port: 5005,
  },
  module: {
    loaders: [{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }],
  },
}
