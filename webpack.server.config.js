const path = require("path"),
  webpack = require("webpack"),
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  fs = require("fs");

var nodeModules = {};
fs
  .readdirSync("node_modules")
  .filter(function(x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = "commonjs " + mod;
  });
module.exports = {
  entry: ["babel-polyfill", "./server/server.js"],
  target: "node",
  output: {
    path: path.join(__dirname, "build/server"),
    filename: "server.js"
  },
  externals: nodeModules,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "server"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ["react", "env"]
          }
        }
      },
      {
        test: /\.json$/,
        include: path.join(__dirname, "../config"),
        exclude: /node_modules/,
        use: { loader: "json" }
      }
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: [".js", ".json"]
  },
  plugins: [
    new CleanWebpackPlugin(["build/server"], {
      // Write logs to console.
      verbose: true
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: "body"
    })
  ]
};
