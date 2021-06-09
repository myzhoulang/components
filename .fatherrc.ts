export default {
  target: 'browser',
  esm: 'babel',
  entry: 'src/index.ts',
  // entry: [
  //   'src/utils/index.ts',
  //   'src/Editor/index.tsx',
  //   'src/InputNumberRange/index.tsx',
  //   'src/Uploader/index.tsx',
  // ],
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
