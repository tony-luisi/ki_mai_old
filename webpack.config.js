const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const NpmInstallPlugin = require('npm-install-webpack-plugin');


const TARGET = process.env.npm_lifecycle_event

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

const common = {
    entry: PATHS.app,
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    output: {
        path: PATHS.build,
        filename: "bundle.js"
    },
    module: {
    loaders: [
      {
        // Test expects a RegExp! Note the slashes!
        test: /\.css$/,
        loaders: ['style', 'css'],
        // Include accepts either a path or an array of paths.
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        // Enable caching for improved performance during development
        // It uses default OS directory by default. If you need something
        // more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
        loaders: ['babel?cacheDirectory'],
        // Parse only app files! Without this it will go through entire project.
        // In addition to being slow, that will most likely result in an error.
        include: PATHS.app
      }
    ]
  }

};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devServer: {
     contentBase: PATHS.build,
     devtool: 'eval-source-map',


     // Enable history API fallback so HTML5 History API based
     // routing works. This is a good default that will come
     // in handy in more complicated setups.
     historyApiFallback: true,
     hot: true,
     inline: true,
     progress: true,
     colors: true,

     // Display only errors to reduce the amount of output.
     stats: 'errors-only',

     // Parse host and port from env so this is easy to customize.
     //
     // If you use Vagrant or Cloud9, set
     // host: process.env.HOST || '0.0.0.0';
     //
     // 0.0.0.0 is available to all network devices unlike default
     // localhost
     host: process.env.HOST,
     port: process.env.PORT
   },
   plugins: [
     new webpack.HotModuleReplacementPlugin()
   ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {});
}
