const path = require("path"),
  webpack = require("webpack"),
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["babel-polyfill", "./hot_and_gui/static/index.js"],
  output: {
    path: path.join(__dirname, "build/hot_and_gui/static"),
    filename: "[chunkhash].js"
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 3,
          name: "commons",
          enforce: true
        },
        vendor: {
          chunks: "initial",
          test: path.resolve(__dirname, "node_modules"),
          name: "vendor",
          enforce: true
        }
      }
    }
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
