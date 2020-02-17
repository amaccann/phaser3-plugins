const path = require('path');

const babelRc = require('../../../babel.config');

const SRC = './src';
const ASSETS = `${SRC}/assets`;
const DEMO = `${SRC}/demo`;

const resolve = (p = '') => path.resolve(process.cwd(), p);

module.exports = {
  BABEL: babelRc,
  ASSETS_FOLDER_NAME: ASSETS,
  ASSETS: resolve(`${ASSETS}`),
  DEMO: resolve(DEMO),
  DIST: resolve('./dist'),
  ROOT: resolve('./'),
  SRC: resolve(SRC),
};
