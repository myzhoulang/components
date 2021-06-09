export default {
  target: 'browser',
  esm: 'babel',
  entry: 'src/index.ts',
  cjs: 'babel',
  umd: {
    name: 'zc',
    sourcemap: true,
    globals: {
      react: 'React',
      antd: 'antd',
    },
  },
  runtimeHelpers: true,
  extractCSS: true,
  // lessInBabelMode: true,
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
};
