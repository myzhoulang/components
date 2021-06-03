export default {
  target: 'browser',
  esm: 'babel',
  lessInBabelMode: true,
  entry: [
    'src/Editor/index.tsx',
    'src/InputNumberRange/index.tsx',
    'src/Uploader/index.tsx',
    'src/utils/index.ts',
  ],
  // cjs: 'babel',
  // umd: {
  //   minFile: true,
  //   globals: {
  //     react: 'React',
  //     antd: 'antd',
  //   },
  //   file: 'zc',
  // },
  // runtimeHelpers: true,
  // extractCSS: true,
  // extraBabelPlugins: [
  //   [
  //     'babel-plugin-import',
  //     {
  //       libraryName: 'antd',
  //       libraryDirectory: 'es',
  //       style: true,
  //     },
  //   ],
  // ],
};
