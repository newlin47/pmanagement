module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader', 
        options: {
          presets: ['@babel/preset-react']
        }
      },
      {
        test: /\.(jpg|jpeg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './static/images/',
          },
        },
      },
      {
        test: /\.(jpg|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[name].[ext]',
            outputPath: './static/images/',
          },
        },
      },
    ]
  }
};
