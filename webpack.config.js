//webpack.config.js
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "index.html",
          to: "index.html"
        },
      ],
    }),
  ],
  entry: {
    main: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "index.js" // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  }
};