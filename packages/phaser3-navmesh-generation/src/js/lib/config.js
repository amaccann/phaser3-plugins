const DEFAULT_CONFIG = {
  collisionIndices: [],
  midPointThreshold: 0,
  offsetHullsBy: 0.1,
  tileMap: null,
  tileLayer: null,
  timingInfo: false,
  useMidPoint: false
};

class Config {
  constructor() {
    this._c = {...DEFAULT_CONFIG};
  }

  /**
   * @method get
   * @param {String} key
   */
  get(key) {
    return this._c[key];
  }

  get tileLayer() {
    return this._c.tileLayer;
  }

  get tileMap() {
    return this._c.tileMap;
  }

  /**
   * @method getTileAt
   * @param {Number} x
   * @param {Number} y
   * @return {Phaser.Tilemaps.Tile}
   */
  getTileAt(x, y) {
    return this.tileLayer.getTileAt(x, y, true);
  }

  /**
   * @method gridDimensions
   */
  get gridDimensions() {
    const { width, height } = this.tileMap;
    return { width, height };
  }

  /**
   * @method mapDimensions
   * @return {Object}
   */
  get mapDimensions() {
    const { width, height, tileWidth, tileHeight, widthInPixels, heightInPixels } = this.tileMap;
    return { width, height, tileWidth, tileHeight, widthInPixels, heightInPixels };
  }

  /**
   * @method set
   * @param {Object} config
   */
  set(config = DEFAULT_CONFIG) {
    this._c = { ...DEFAULT_CONFIG, ...config };
  }
}

export default new Config();
