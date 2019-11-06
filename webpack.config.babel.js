import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import safe from 'postcss-safe-parser'
import cssnano from 'cssnano'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const ENV = process.env.NODE_ENV

let Config = {
  context: path.join(__dirname, 'src'),
  entry: [
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'public/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /\.(css|pcss)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/normalize.css')
        ]
      },

      {
        test: /\.(png|svg|jpg|gif|ico|woff|woff2|ttf|eot|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'public/'
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}

if (ENV === 'production') {
  Config = merge(Config, {
    mode: 'production',
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'public/styles.css'
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: {
          parser: safe,
          discardComments: { removeAll: true }
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.(css|pcss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ]
        }
      ]
    }
  })
}

if (ENV === 'development') {
  Config = merge(Config, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      hot: true,
      overlay: true,
      host: '0.0.0.0'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.(css|pcss)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    }
  })
}

const WebpackConfig = Config
export default WebpackConfig
