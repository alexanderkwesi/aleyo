// Polyfill for Array.toSorted() for Node.js 18 compatibility
if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function (compareFn) {
    return [...this].sort(compareFn);
  };
}

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].chunk.js",
    publicPath: "/",
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    host: "localhost",
    port: 3000,
    hot: true,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      // Add custom middleware if needed
      return middlewares;
    },
    historyApiFallback: true,
    client: {
      webSocketURL: "ws://localhost:3000/ws",
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: (error) => {
          if (
            error.message?.includes("No Listener: tabs:outgoing.message.ready")
          ) {
            return false;
          }
          return true;
        },
      },
    },
    webSocketServer: "ws",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    // Fixed proxy configuration for backend API
    proxy: [
      {
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
      },
    ],
    // Speed up dev server
    devMiddleware: {
      stats: "minimal",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react", // Uses classic runtime by default
            ],
            plugins: ["@babel/plugin-transform-runtime"],
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@emotion/react": "@emotion/react",
      "@emotion/styled": "@emotion/styled",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/preview.html",
          to: "preview.html",
          noErrorOnMissing: true,
        },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    new webpack.ProvidePlugin({
      React: "react", // Automatically imports React for classic runtime
    }),
  ],
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 10,
        },
        // Separate MUI packages for better caching
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: "mui",
          chunks: "all",
          priority: 20,
        },
      },
    },
    // Speed up production builds
    minimize: process.env.NODE_ENV === "production",
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
    // Increase cache performance
    cacheDirectory: path.resolve(__dirname, ".cache"),
    compression: false,
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: false, // Disable polling for better performance
  },
  // Performance hints
  performance: {
    hints: false,
  },
  // Speed up builds by ignoring source maps in development
  devtool:
    process.env.NODE_ENV === "production"
      ? "source-map"
      : "eval-cheap-module-source-map",
};
