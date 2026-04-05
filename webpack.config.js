// webpack.config.js - исправленная версия
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    
    entry: {
      main: './js/main.js',
      style: './css/main.css'
    },
    
    output: {
      filename: isProduction ? 'js/[name].min.js' : 'js/[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction
            }
          }
        }),
        new CssMinimizerPlugin()
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true
          }
        }
      },
      // Увеличиваем лимит для предупреждений о размере
      // Это убирает предупреждения о размере бандлов
      usedExports: true,
      sideEffects: true
    },
    
    // Увеличиваем лимит размера для предупреждений
    performance: {
      hints: false, // Отключаем предупреждения о размере
      // Или можно установить лимит:
      // maxEntrypointSize: 512000,
      // maxAssetSize: 512000,
    },
    
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name][ext]'
          }
        }
      ]
    },
    
    plugins: [
      new CleanWebpackPlugin(),
      
      new MiniCssExtractPlugin({
        filename: isProduction ? 'css/[name].min.css' : 'css/[name].css'
      }),
      
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        minify: isProduction ? {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        } : false,
        chunks: ['main', 'style']
      }),
      
      new HtmlWebpackPlugin({
        template: './privacy-policy.html',
        filename: 'privacy-policy.html',
        minify: isProduction ? {
          collapseWhitespace: true,
          removeComments: true
        } : false
      }),
      
      // Используем ignoreWarnings вместо warningsFilter
      new CopyPlugin({
        patterns: [
          { 
            from: 'php/', 
            to: 'php/',
            noErrorOnMissing: true
          },
          { 
            from: 'proekty/', 
            to: 'proekty/',
            noErrorOnMissing: true,
            globOptions: {
              ignore: [
                '**/*.map',
                '**/*.map.*',
                '**/bootstrap/**/*.map'
              ]
            }
          },
          { 
            from: 'data/', 
            to: 'data/',
            noErrorOnMissing: true
          },
          { from: '.htaccess', to: '.', noErrorOnMissing: true },
          { from: 'favicon.ico', to: '.', noErrorOnMissing: true },
          { from: '.env.example', to: '.', noErrorOnMissing: true }
        ]
      })
    ],
    
    // Используем ignoreWarnings вместо устаревшего warningsFilter
    ignoreWarnings: [
      /Conflicting order/,
      /Conflict: Multiple assets/
    ],
    
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      port: 8080,
      hot: true,
      open: true
    },
    
    devtool: isProduction ? false : 'eval-source-map',
    
    // Дополнительные настройки для уменьшения размера
    resolve: {
      extensions: ['.js', '.css'],
      alias: {
        // Можно добавить алиасы для больших библиотек
        'three': path.resolve(__dirname, 'node_modules/three/build/three.min.js')
      }
    }
  };
};