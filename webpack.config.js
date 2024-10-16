const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  
  mode: 'production', // Ensure production mode
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js', // Output main JS file
  },
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
  },
  
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource', // Use Webpack's asset/resource type for images
        generator: {
          filename: 'images/[hash][ext][query]', // Output images to a folder in 'dist'
        },
      },
    ],
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Your public HTML file
      inject: true,
    }),
  ],
}
