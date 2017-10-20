const path = require('path')

module.exports = {
  entry: './src/yayson.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'yayson.js',
    library: 'yayson',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }],
  },
}
