const path = require('path');

const SRC = './src';
const ASSETS = `${SRC}/assets`;

const resolve = (p = '') => path.resolve(process.cwd(), p);

module.exports = {
  ASSETS_FOLDER_NAME: ASSETS,
  ASSETS: resolve(`${ASSETS}`),
  DIST: resolve('./dist'),
  ROOT: resolve('./'),
  SRC: resolve(SRC),
};
