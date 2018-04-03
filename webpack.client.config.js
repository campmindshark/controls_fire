const path = require("path"),
  webpack = require("webpack"),
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["babel-polyfill", "./hot_and_gui/static/index.js"],
  output: {
    path: path.join(__dirname, "build/hot_and_gui/static"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "hot_and_gui"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ["react", "env"]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["build/hot_and_gui"], {
      // Write logs to console.
      verbose: true
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: "body"
    })
  ]
};
