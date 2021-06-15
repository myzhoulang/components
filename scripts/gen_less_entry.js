const fs = require('fs');
const { join } = require('path');
const fg = require('fast-glob');

const baseUrl = `${join(__dirname, '../src')}`;
const lessFiles = fg.sync(`${baseUrl}/**/*.less`, {
  ignore: ['**/demos/**'],
  deep: 5,
});
const importFiles = lessFiles.map((lessPath) => {
  return `@import "../es${lessPath.replace(baseUrl, '')}";`;
});

const distPath = `${join(__dirname, '../dist', `components.less`)}`;

fs.writeFileSync(distPath, importFiles.join('\n'));
