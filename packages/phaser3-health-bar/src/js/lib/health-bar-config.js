const DEFAULT_HEALTH_PROPS = {
  current: 'health',
  max: 'maxHealth',
  min: 'minHealth',
};

export default class HealthBarConfig {
  /**
   * @name camera
   * @type Phaser.Cameras.Scene2D.Camera
   */
  camera = null;
  /**
   * @name backgroundColor
   * @type Number
   */
  backgroundColor = 0x000000;
  /**
   * @name barHeight
   * @type Number
   */
  barHeight = 15;
  /**
   * @name currentValueColor
   * @type Number
   */
  currentValueColor = 0x33ff33;
  /**
   * @name outlineColor
   * @type Number
   */
  outlineColor = 0xffffff;
  /**
   * @name outlineWidth
   * @type Number
   */
  outlineWidth = 2;
  /**
   * @name propsToWatch
   * @type Object
   */
  propsToWatch = DEFAULT_HEALTH_PROPS;

  constructor(props = {}) {
    Object.keys(props).forEach(key => {
      this[key] = props[key];
    });
  }
}
