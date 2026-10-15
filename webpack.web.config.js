const path = require('path');

// Public path for GitHub project pages, e.g. /BicepEditor/ for
// https://<owner>.github.io/BicepEditor/. Override with --env PUBLIC_PATH.
module.exports = (env = {}) => {
  const publicPath = env.PUBLIC_PATH ?? '/BicepEditor/';
  return {
    mode: 'production',
    entry: './src/renderer/renderer.ts',
    target: 'web',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader', options: { transpileOnly: false } }],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'web'),
      filename: 'renderer.js',
      publicPath: publicPath,
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@common': path.resolve(__dirname, 'src/common/'),
        '@renderer': path.resolve(__dirname, 'src/renderer/'),
      },
    },
    performance: {
      hints: 'error',
      // Blockly is a large dependency; enforce an explicit ceiling of 1 MiB
      // so bundle growth beyond this fails the build (warnings are errors).
      maxAssetSize: 1024 * 1024,
      maxEntrypointSize: 1024 * 1024,
    },
  };
};
