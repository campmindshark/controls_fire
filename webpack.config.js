var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./hot_and_gui/static/index.js"],
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
        },

      }
    ]
  },
   plugins: [
     new HtmlWebpackPlugin({
       template: "./hot_and_gui/static/index.html",
       filename: "index.html",
       inject: "body"
     })
  ]
};
