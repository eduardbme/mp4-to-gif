const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join, relative, isAbsolute } = require('path');

const outDir = join(__dirname, '../../dist/apps/mp4-to-gif-api');

module.exports = {
  output: {
    devtoolModuleFilenameTemplate(info) {
      const { absoluteResourcePath, namespace, resourcePath } = info;

      if (isAbsolute(absoluteResourcePath)) {
        return relative(outDir, absoluteResourcePath);
      }

      // Mimic Webpack's default behavior:
      return `webpack://${namespace}/${resourcePath}`;
    },
    path: outDir,
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/bootstrap.ts',
      tsConfig: './tsconfig.app.json',
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMap: true,
    }),
  ],
};
