import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'components',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  // more config: https://d.umijs.org/config

  cssLoader: {
    localsConvention: 'camelCase',
  },
  // 单语言配置方式如下
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/umijs/dumi',
    },
  ],
  menus: {
    '/components': [
      {
        title: '架构设计',
        children: ['components.md'],
      },
      {
        title: '数据录入',
        children: ['InputNumberRange', 'Editor', 'Uploader'],
      },
    ],
  },
});
