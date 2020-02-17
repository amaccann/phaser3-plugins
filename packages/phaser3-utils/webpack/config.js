const path = require('path');

const babelRc = require('../../../babel.config');

const SRC = './src';
const ASSETS = `${SRC}/assets`;
const DEMO = `${SRC}/demo`;

const resolve = (p = '') => path.resolve(process.cwd(), p);

module.exports = {
  ASSETS_FOLDER_NAME: ASSETS,
  ASSETS: resolve(`${ASSETS}`),
  BABEL: babelRc,
  DEMO: resolve(DEMO),
  DIST: resolve('./dist'),
  ROOT: resolve('./'),
  SRC: resolve(SRC),
};
