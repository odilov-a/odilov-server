const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "node",
  entry: "./server.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: "ejs-webpack-loader",
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: "file-loader",
        options: {
          outputPath: "images/",
          publicPath: "images/",
        },
        include: [path.resolve(__dirname, "images"), path.resolve(__dirname, "uploads")],
      },      
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "views",
          to: path.resolve(__dirname, "dist", "views"),
        },
      ],
    }),
  ],
};
