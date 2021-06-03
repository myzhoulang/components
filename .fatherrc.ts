export default {
  target: 'browser',
  esm: 'babel',
  entry: [
    'src/Editor/index.tsx',
    'src/InputNumberRange/index.tsx',
    'src/Uploader/index.tsx',
    'src/utils/index.ts',
  ],
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
