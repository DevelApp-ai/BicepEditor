const path = require('path');

module.exports = [
  // Main process webpack configuration
  {
    mode: 'development',
    entry: './src/main/main.ts',
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }]
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@common': path.resolve(__dirname, 'src/common/'),
        '@main': path.resolve(__dirname, 'src/main/')
      }
    },
    node: {
      __dirname: false
    }
  },
  // Renderer process webpack configuration
  {
    mode: 'development',
    entry: './src/renderer/renderer.ts',
    target: 'electron-renderer',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }]
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'renderer.js'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@common': path.resolve(__dirname, 'src/common/'),
        '@renderer': path.resolve(__dirname, 'src/renderer/')
      }
    }
  }
];
